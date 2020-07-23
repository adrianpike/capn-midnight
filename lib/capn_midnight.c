#include <stdio.h>
#include <limits.h>


int encode(char* input, int inputLength, char* output, int* outputLength) {
  for (int byte = 0; byte < inputLength; byte++) {
    printf("%c:", input[byte]);
    for(int bit = 0; bit < CHAR_BIT; bit++) {
      
    }
    printf("\n");
  }
}

int main() {
  char* out;
  int outLength;

  encode("testing", 7, out, &outLength);

  return 0;
}
