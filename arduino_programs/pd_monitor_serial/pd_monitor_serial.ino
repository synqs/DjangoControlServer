int pins[12] = {A0,A1,A2,A3,A4,A5,6,7,8,9,10,11};
double values[12] = {0,0,0,0,0,0,0,0,0,0,0,0};
float R1 = 47000.0;
float R2 = 33000.0;
char mode;

#include <Console.h>
#include <Bridge.h>

void setup() {
  Bridge.begin(); // Console startup
  while (!Console);
  Console.println("Connected.");
  for(int i=0; i<12; i++) pinMode(pins[i],INPUT); // Setup pins for analog read
}

void loop() {
  int i = 3;
  //for (int i = 0; i <= 11; i++) {
  //char output[5];
    values[i] = analogRead(pins[i]) * 0.01257558; // Own calibration
    Console.print(values[i], 6); Console.print(", ");
  //}
  Console.println();
  delay(50); // Poll every x ms
}
