#include <node.h>
#include <v8.h>

#include <cstdio>
#include <fstream>

//#include <aff3ct.hpp>

static void encode(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();
  if (!args[0]->IsArrayBuffer()) {
    isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "encode must be given a Buffer").ToLocalChecked()));
    return;
  }

  v8::Local<v8::ArrayBuffer> input = args[0].As<v8::ArrayBuffer>();
  std::shared_ptr<v8::BackingStore> backing = input->GetBackingStore();
  uint8_t *inputData = static_cast<uint8_t*>(backing->Data());

  v8::Local<v8::ArrayBuffer> encodedBuffer;
  encodedBuffer = v8::ArrayBuffer::New(isolate, inputData, backing->ByteLength());
  
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  args.GetReturnValue().Set(encodedBuffer);
}

static void decode(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();
  if (!args[0]->IsArrayBuffer()) {
    isolate->ThrowException(v8::Exception::TypeError(v8::String::NewFromUtf8(isolate, "decode must be given a Buffer").ToLocalChecked()));
    return;
  }
  v8::Local<v8::ArrayBuffer> input = args[0].As<v8::ArrayBuffer>();
  std::shared_ptr<v8::BackingStore> backing = input->GetBackingStore();
  uint8_t *inputData = static_cast<uint8_t*>(backing->Data());

  v8::Local<v8::ArrayBuffer> encodedBuffer;
  encodedBuffer = v8::ArrayBuffer::New(isolate, inputData, backing->ByteLength());
  
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  args.GetReturnValue().Set(encodedBuffer);
}

void Initialize(v8::Local<v8::Object> exports) {
  NODE_SET_METHOD(exports, "encode", encode);
  NODE_SET_METHOD(exports, "decode", decode);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
