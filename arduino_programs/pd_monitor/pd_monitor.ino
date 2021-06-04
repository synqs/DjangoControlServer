/*
Arduino Yún Bridge example
This example for the YunShield/Yún shows how
to use the Bridge library to access the digital and
analog pins on the board through REST calls.
It demonstrates how you can create your own API when
using REST style calls through the browser.

Possible commands created in this shetch:
"/arduino/read/2"-> analogRead(2)
"/arduino/read/all" -> analogRead(0); analogRead(1); ...

refer to: http://www.arduino.cc/en/Tutorial/Bridge
*/

int pin;
int V_in[] = {A0, A1, A2, A3, A4, A5};
float voltage;  float svoltage;
float R1 = 47000.0;
float R2 = 33000.0;

#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>

// Listen to the default port 5555, the Yún webserver
// will forward there all the HTTP requests you send

BridgeServer server;

void setup() {
	Bridge.begin();
	server.listenOnLocalhost();			          // Listen for incoming connection only from localhost
	server.begin();
}

void loop() {
	BridgeClient client = server.accept();		// Get clients coming from server

	if (client) {					                    // There is a new client?
		process(client);			                  // Process request
		client.stop();				                  // Close connection and free resources.
	}

	delay(50);                                // Poll every 50ms
}

void process(BridgeClient client) {
	String command = client.readStringUntil('/');	// Read the command

	if (command == "read") {			            // Is "read" command?
    client.print(command); client.print(" ");
		readCommand(client);
	}
}

void readCommand(BridgeClient client) {
  String component = client.readStringUntil('\r');  // Read component
  client.print(component);

  if (component == "all") {
    client.print("first case: ");
    for (int i = 0; i <= 5; i++) {
      voltage = analogRead(V_in[i]) * 0.01257558; // own calibration
      client.print(voltage); client.print(", ");
    }
  }
  else {
    for (int i = 0; i <= component.length(); i++) {
      pin = component.charAt(i);
      client.println(pin);
      //voltage = analogRead(pin) * 0.01257558;
      //client.print(voltage);
    }
  }
}
