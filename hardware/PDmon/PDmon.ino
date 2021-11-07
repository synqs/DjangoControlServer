/* Load all necessary libraries */
#include <Bridge.h> // library for communication with linux processor
#include <Process.h> // library for running processes on the linux processor

/* Start processes */
Process date; // process used to get the date

/* Define global objects */
int pins[6] = {A0, A1, A2, A3, A4, A5}; // analog reading of pins
float values[6] = {0, 0, 0, 0, 0, 0}; // running average values
float R1 = 47000.0;
float R2 = 33000.0;

/* Setup the arduino */
void setup() {
  Bridge.begin(); // setup external communication with bridge startup
  for (int i = 0; i < 6; i++) pinMode(pins[i], INPUT); // setup pins for analog read
}

/* Actual code */
void loop() {
  for (int i = 0; i < 6; i++) { // read selected pins and store result
    char v_output[4];
    values[i] = analogRead(pins[i])*5.000/1023.0;
    dtostrf(values[i], sizeof(v_output), 3, v_output); // read and convert value
    Bridge.put("A" + String(i), v_output); // store the result

    /* char v12_output[4];
    values[i] = analogRead(pins[i])*5.000/1023.0*((R1 + R2)/R2);
    dtostrf(values[i], sizeof(v12_output), 3, v12_output); // read and convert value
    Bridge.put("P" + String(i), v12_output); // store the result */
  }

  // get the current time
  if (!date.running()) { // check whether the process isn't running
    date.begin("date");
    date.addParameter("+%Y-%m-%d %H:%M:%S");
    date.run();
  }
  while (date.available() > 0) { // read the time given by the linux kernel
    Bridge.put("updated", date.readStringUntil('\n'));
  }
}
