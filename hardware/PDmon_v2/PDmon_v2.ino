/* Load all necessary libraries */
#include <Bridge.h> // library for communication with linux processor
#include <Process.h> // library for running processes on the linux processor
#include <BridgeServer.h>
#include <BridgeClient.h>

/* Start processes */
Process date; // process used to get the date
// Listen to the default port 5555, the Yún webserver
// will forward there all the HTTP requests you send
BridgeServer server;

/* Define global objects */
int pins[6] = {A0, A1, A2, A3, A4, A5}; // analog reading of pins
float values[6] = {0, 0, 0, 0, 0, 0}; // running average values

/* Setup the arduino */
void setup() {
  Bridge.begin(); // setup external communication with bridge startup
  for (int i = 0; i < 6; i++) pinMode(pins[i], INPUT); // setup pins for analog read

  // Listen for incoming connection only from localhost
  // (no one from the external network could connect)
  server.listenOnLocalhost();
  server.begin();
}

/* Actual code */
void loop() {
  for (int i = 0; i < 6; i++) { // read selected pins and store result
    char v_output[4]; char p_output[4]; // output char
    // values[k] = 0.5*(values[k] + analogRead(pins[k])); // smooth the measured value
    dtostrf(analogRead(pins[i])*5.000/1023.0, sizeof(v_output), 3, v_output); // read and convert value
    Bridge.put("A" + String(i), v_output); // store the result
    
    dtostrf(analogRead(pins[i])*5.000/1023.0, sizeof(p_output), 3, p_output); // read and convert value
    Bridge.put("P" + String(i), p_output); // store the result
  }

  // get the current time
  if (!date.running()) { // check whether the process isn't running
    date.begin("date");
    date.addParameter("+%d.%m.%Y %H:%M:%S");
    date.run();
  }
  while (date.available() > 0) { // read the time given by the linux kernel
    Bridge.put("updated", date.readStringUntil('\n'));
  }

  /*
  // Get clients coming from server
  BridgeClient client = server.accept();

  // There is a new client?
  if (client) {
    // Process request
    process(client);

    // Close connection and free resources.
    client.stop();
  }*/
  
  delay(0);
}
/*
void process(BridgeClient client) {
  // read the command
  String command = client.readStringUntil('/');
  // is "write" command?
  if (command == "write") {
    writeCommand(client);
  }
}


void writeCommand(BridgeClient client) {
  String component = client.readStringUntil('/');
  if (component == "channels") { // edit setpoint
    String string = "";
    string = client.readStringUntil('\r'); // read the string channel from url
    if (string) {
      // string.toCharArray(buff, len); // convert into char and save in key value list
      string.remove(6);
      channels = string;
    }
    Bridge.put("channels", channels); // add some kind of confirmation?
  }
} */

float conversion(float voltage) {
	float pressure = pow(10,(voltage-7.75)/0.75)*1000000;
	return pressure;
}
