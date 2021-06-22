/*
Possible commands created in this shetch:
"/arduino/read/2"-> analogRead(2)
"/arduino/read/all" -> analogRead(0); analogRead(1); ...

refer to: http://www.arduino.cc/en/Tutorial/Bridge

Many parts of this script are copied from Julian Robertz approach to monitor and control the Arduino 
YUN rev 2. He is not using a server but rather makes use of the Linux System running on the YUN itself.

refer to: https://git.kip.uni-heidelberg.de/atta/monitoringbox/-/tree/master/
*/

int pins[12] = {A0,A1,A2,A3,A4,A5,6,7,8,9,10,11};
float values[12] = {0,0,0,0,0,0,0,0,0,0,0,0};
float R1 = 47000.0;
float R2 = 33000.0;

#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>

// Listen to the default port 5555, the Yún webserver
// will forward there all the HTTP requests you send

BridgeServer server;

void setup() {
	Bridge.begin(); // Bridge startup

  for(int i=0; i<12; i++) pinMode(pins[i],INPUT); // Setup pins for analog read

	server.listenOnLocalhost(); // Listen for incoming connection only from localhost
	server.begin();
}

void loop() {
	BridgeClient client = server.accept(); // Get clients coming from server

	if (client) { // There is a new client?
		process(client); // Process request
		client.stop(); // Close connection and free resources.
	}

	delay(50); // Poll every 50ms
}

void process(BridgeClient client) {
  String command = client.readStringUntil('/');	// Read the command
  String component = client.readStringUntil('\r'); // Read component
  
  if (component == "all") { // Read all channels and store in values
    for (int i = 0; i <= 11; i++) {
      char output[5];
      values[i] = analogRead(pins[i]) * 0.01257558; // Own calibration
      // client.print(values[i]); client.print(", ");
      dtostrf(values[i],sizeof(output),2,output); // Convert values to string of format "xx.yy"
      client.print(output); client.print(", ");
    }
  }

	//if (command == "read") { // Is "read" command?
  //  readCommand(client);
	//}
}

/*
void readCommand(BridgeClient client) {
  String component = client.readStringUntil('\r'); // Read component

  if (component == "all") { // Read all channels and store in values
    for (int i = 0; i <= 11; i++) {
      char output[5];
      values[i] = analogRead(pins[i]) * 0.01257558; // Own calibration
      // client.print(values[i]); client.print(", ");
      dtostrf(values[i],sizeof(output),2,output); // Convert values to string of format "xx.yy"
      client.print(output); client.print(", ");
    }
  }

  // IMPLEMENT SINGLE/SELECTIVE CHANNEL READOUT ?
  else {
    for (int i = 0; i <= component.length(); i++) {
      pin = component.charAt(i);
      client.println(pin);
      //voltage = analogRead(pin) * 0.01257558;
      //client.print(voltage);
    }
  }
}
*/
