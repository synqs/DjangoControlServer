/* Load all necessary libraries */
#include <Bridge.h> // library for communication with linux processor
#include <Process.h> // library for running processes on the linux processor
#include <DHT.h>

#define DHTPIN 2     // Digital pin connected to the DHT sensor
#define DHTTYPE DHT11   // DHT 11
DHT dht(DHTPIN, DHTTYPE);

/* Start processes */
Process date; // process used to get the date

/* Setup the arduino */
void setup() {
  Bridge.begin(); // setup external communication with bridge startup
  dht.begin();
}

void loop() {
  // Wait a few seconds between measurements.
  delay(3000);

  // Reading temperature or humidity takes about 250 milliseconds!
  // Sensor readings may also be up to 2 seconds 'old' (its a very slow sensor)
  float h = dht.readHumidity();
  // Read temperature as Celsius (the default)
  float t = dht.readTemperature();
  
  // Check if any reads failed and exit early (to try again).
  if (isnan(h) || isnan(t)) {
    Bridge.put("error", "Failed to read from DHT sensor!");
    return;
  }
  
  char tbuff[5];
  dtostrf(t, sizeof(tbuff), 2, tbuff); // read and convert value
  char hbuff[5];
  dtostrf(h, sizeof(hbuff), 2, hbuff); // read and convert value

  Bridge.put("T", tbuff); // store the results
  Bridge.put("H", hbuff); 
  
  // get the current time
  if (!date.running()) { // check whether the process isn't running
    date.begin("date");
    date.addParameter("+%d/%m/%Y %H:%M:%S");
    date.run();
  }
  while (date.available() > 0) { // read the time given by the linux kernel
    Bridge.put("updated", date.readStringUntil('\n'));
  }
}
