/* Load all necessary libraries */
#include <Bridge.h>         //library for communication with linux processor
#include <Process.h>        //library for running processes on the linux processor

/* Start processes */
Process date; //process used to get the date

/* Define global objects */
  /* general objects */
  int pins[12] = {A0,A1,A2,A3,A4,A5,6,7,8,9,10,11}; //analog reading of digital pins requires other pin numbers than usually used or labeled on the hardware: 6 for 4, 7 for 6, 11 for 12
  int values[12] = {0,0,0,0,0,0,0,0,0,0,0,0}; //running average values

/* setup the arduino */
void setup() {
  // setup external communication
  Bridge.begin(); // bridge startup

  // setup pins for analog read
  for(int i=0; i<12; i++) pinMode(pins[i],INPUT);
}

/* process */
void loop() {
  // read all channels
  for(int i=0; i<12; i++) { //read pin and store result
    char output[5]; //output char
    values[i] = 0.5*(values[i] + analogRead(pins[i])); //smooth the measured value
    dtostrf(values[i]*5.0/1023,sizeof(output),3,output); //read and convert value
    Bridge.put("CH" + String(i+1) + "_value",output); //store the result
  }
  
  // get the current time
  if(!date.running()) { //check whether the process isn't running
    date.begin("date");
    date.addParameter("+%d.%m.%Y %H:%M:%S");
    date.run();
  }
  while(date.available() > 0) { //read the time given by the linux kernel
    Bridge.put("updated",date.readStringUntil('\n'));
  }
}
