/* Load all necessary libraries */
#include <Bridge.h> // library for communication with linux processor
#include <Process.h> // library for running processes on the linux processor
#include <BridgeServer.h>
#include <BridgeClient.h>

/* Start processes */
Process date; // process used to get the date

/* Define global objects */
int pins[12] = {A0,A1,A2,A3,A4,A5,6,7,8,9,10,11}; // analog reading of digital pins requires other pin numbers than usually used or labeled on the hardware: 6 for 4, 7 for 6, 11 for 12
int values[12] = {0,0,0,0,0,0,0,0,0,0,0,0}; // running average values

/* Setup the arduino */
void setup() {
  Bridge.begin(); // setup external communication with bridge startup
  for(int i=0; i<12; i++) pinMode(pins[i],INPUT); // setup pins for analog read
}

/* Actual code */
void loop() {
  for(int i=0; i<12; i++) { // read all pins and store result
    char output[4]; // output char
    values[i] = 0.5*(values[i] + analogRead(pins[i])); // smooth the measured value
    dtostrf(analogRead(pins[i])*5.0/1023,sizeof(output),1,output); // read and convert value
    char buff[2];
    sprintf(buff,"%02d",i); // label padding for sorting by channels afterwards
    Bridge.put("CH" + String(buff),output); // store the result
  }
  
  /* Since there is some trouble with sorting the data, we will leave it like this at the moment */
  // get the current time
  if(!date.running()) { // check whether the process isn't running
    date.begin("date");
    date.addParameter("+%H:%M:%S");
    date.run();
  }
  while(date.available() > 0) { // read the time given by the linux kernel
    Bridge.put("updated",date.readStringUntil('\n'));
  }
}
