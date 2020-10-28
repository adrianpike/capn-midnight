#include <node.h>
#include <v8.h>

#include <cstdio>
#include <fstream>

extern "C" {
  int lte_turbo_decode_unpack(struct tdecoder *dec, int len, int iter,
			    uint8_t *output, const int8_t *d0,
			    const int8_t *d1, const int8_t *d2);
  int lte_turbo_encode(const struct lte_turbo_code *code, const uint8_t *input, uint8_t *d0, uint8_t *d1, uint8_t *d2);
  struct tdecoder *alloc_tdec();

}

#include "../deps/turbofec/include/turbofec/turbo.h"

#define MAX_LEN_BITS		32768
/* Maximum LTE code block size of 6144 */
#define LEN		TURBO_MAX_K


const struct lte_turbo_code lte_turbo = {
  .n = 2,
  .k = 4,
  .len = LEN,
  .rgen = 013,
  .gen = 015,
};

static void encode(const v8::FunctionCallbackInfo<v8::Value>& args) {
  // TODO: experiment with block length?
  v8::Isolate* isolate = args.GetIsolate();
  if (!args[0]->IsArrayBuffer()) {
    isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
    return;
  }

  v8::Local<v8::ArrayBuffer> input = args[0].As<v8::ArrayBuffer>();
  std::shared_ptr<v8::BackingStore> backing = input->GetBackingStore();
  uint8_t *inputData = static_cast<uint8_t*>(backing->Data());

  if (backing->ByteLength() > lte_turbo.len * 8) {
    isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "Too much input").ToLocalChecked()));
    return;
  }
  // BUG: If it's bigger than LEN, we need to split it up :)

  int l;
	uint8_t *in, *bu0, *bu1, *bu2;

  in  = (uint8_t*) malloc(sizeof(uint8_t) * MAX_LEN_BITS);

  for (int i=0; i < backing->ByteLength() + 4; i++) {
    in[0 + i * 8] = ((inputData[i] & (0b1 << 7)) > 0) ? 0b1 : 0b0;
    in[1 + i * 8] = ((inputData[i] & (0b1 << 6)) > 0) ? 0b1 : 0b0;
    in[2 + i * 8] = ((inputData[i] & (0b1 << 5)) > 0) ? 0b1 : 0b0;
    in[3 + i * 8] = ((inputData[i] & (0b1 << 4)) > 0) ? 0b1 : 0b0;
    in[4 + i * 8] = ((inputData[i] & (0b1 << 3)) > 0) ? 0b1 : 0b0;
    in[5 + i * 8] = ((inputData[i] & (0b1 << 2)) > 0) ? 0b1 : 0b0;
    in[6 + i * 8] = ((inputData[i] & (0b1 << 1)) > 0) ? 0b1 : 0b0;
    in[7 + i * 8] = ((inputData[i] & (0b1 << 0)) > 0) ? 0b1 : 0b0;
  }

  // Why bits become bytes, you say? Because we're using SIMD!
  bu0 = (uint8_t*) malloc(sizeof(uint8_t) * MAX_LEN_BITS);
  bu1 = (uint8_t*) malloc(sizeof(uint8_t) * MAX_LEN_BITS);
  bu2 = (uint8_t*) malloc(sizeof(uint8_t) * MAX_LEN_BITS);
  l = lte_turbo_encode(&lte_turbo, in, bu0, bu1, bu2);

  // bu0 goes straight to the ring buffer output
  // bu1 and bu2 get interlaced onto the end

  // fuckin yikes
  for (int i=0;i<LEN;i++) {
    bu0[i + LEN] = bu1[i];
  }
  for (int i=0;i<LEN;i++) {
    bu0[i + (LEN * 2)] = bu2[i];
  }

  v8::Local<v8::ArrayBuffer> encodedBuffer;
  encodedBuffer = v8::ArrayBuffer::New(isolate, bu0, l);

  // TODO: repack it out of binary into a string for the main `msg` output
  // In the meantime,
  v8::Local<v8::ArrayBuffer> encodedBuffer1, encodedBuffer2, inBuffer;
  encodedBuffer1 = v8::ArrayBuffer::New(isolate, bu1, l);
  encodedBuffer2 = v8::ArrayBuffer::New(isolate, bu2, l);
  inBuffer = v8::ArrayBuffer::New(isolate, in, backing->ByteLength() * 8);
  
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  v8::Local<v8::Object> retObj = v8::Object::New(isolate);
  retObj->Set(context, v8::String::NewFromUtf8(isolate, "msg").ToLocalChecked(), encodedBuffer);
  retObj->Set(context, v8::String::NewFromUtf8(isolate, "bu1").ToLocalChecked(), encodedBuffer1);
  retObj->Set(context, v8::String::NewFromUtf8(isolate, "bu2").ToLocalChecked(), encodedBuffer2);
  retObj->Set(context, v8::String::NewFromUtf8(isolate, "in").ToLocalChecked(), inBuffer);
  args.GetReturnValue().Set(retObj);


//  args.GetReturnValue().Set(encodedBuffer);

//////// Lets just try a raw decode *shrug*
/*
  uint8_t *output;
  int iterations = 4;
  struct tdecoder *tdec = alloc_tdec();
	int8_t *bs0, *bs1, *bs2;
	bs0 = (int8_t*) malloc(sizeof(int8_t) * MAX_LEN_BITS);
	bs1 = (int8_t*) malloc(sizeof(int8_t) * MAX_LEN_BITS);
	bs2 = (int8_t*) malloc(sizeof(int8_t) * MAX_LEN_BITS);
  output = (uint8_t*) malloc(sizeof(uint8_t) * MAX_LEN_BITS);

  for (int i=0;i<LEN;i++) {
    bs0[i] = bu0[i];
  }
  for (int i=0;i<LEN;i++) {
    bs1[i] = bu0[i + LEN];
  }
  for (int i=0;i<LEN;i++) {
    bs2[i] = bu0[i + LEN * 2];
  }


  lte_turbo_decode_unpack(tdec, LEN, iterations, output, bs0, bs1, bs2);
  v8::Local<v8::ArrayBuffer> decodedBuffer;
  decodedBuffer = v8::ArrayBuffer::New(isolate, output, LEN * 3); // BUG: should be bu0, bu1, and bu2
  args.GetReturnValue().Set(decodedBuffer);*/
}

static void decode(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();

  v8::Local<v8::ArrayBuffer> input = args[0].As<v8::ArrayBuffer>();
  std::shared_ptr<v8::BackingStore> backing = input->GetBackingStore();
  uint8_t *inputData = static_cast<uint8_t*>(backing->Data());

  uint8_t *output;
  int8_t *bu0, *bu1, *bu2;

//  bu0 = (int8_t *)inputData;

  int iterations = 4;

  struct tdecoder *tdec = alloc_tdec();

  output  = (uint8_t*) malloc(sizeof(uint8_t) * MAX_LEN_BITS);
  bu0 = (int8_t*) malloc(sizeof(int8_t) * MAX_LEN_BITS);
  bu1 = (int8_t*) malloc(sizeof(int8_t) * MAX_LEN_BITS);
  bu2 = (int8_t*) malloc(sizeof(int8_t) * MAX_LEN_BITS);
  
  for (int i=0;i<LEN;i++) {
    bu0[i] = inputData[i];
    bu1[i] = inputData[i + LEN];
    bu2[i] = inputData[i + (LEN * 2)];
  }

  lte_turbo_decode_unpack(tdec, LEN, iterations, output, bu0, bu1, bu2);

  v8::Local<v8::ArrayBuffer> decodedBuffer;
  decodedBuffer = v8::ArrayBuffer::New(isolate, output, LEN); // BUG: should be bu0, bu1, and bu2

  // TODO: repack it out of binary
  
  args.GetReturnValue().Set(decodedBuffer);
}

void Initialize(v8::Local<v8::Object> exports) {
  NODE_SET_METHOD(exports, "encode", encode);
  NODE_SET_METHOD(exports, "decode", decode);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
