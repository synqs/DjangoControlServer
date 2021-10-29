/* Load all necessary libraries */
#include <Bridge.h> // library for communication with linux processor
#include <Process.h> // library for running processes on the linux processor
#include <dht_nonblocking.h>
#define DHT_SENSOR_TYPE DHT_TYPE_11

/* Start processes */
Process date; // process used to get the date

static const int DHT_SENSOR_PIN = 2;
DHT_nonblocking dht_sensor( DHT_SENSOR_PIN, DHT_SENSOR_TYPE );

/* Setup the arduino */
void setup() {
  Bridge.begin(); // setup external communication with bridge startup
}



/*
 * Poll for a measurement, keeping the state machine alive.  Returns
 * true if a measurement is available.
 */
static bool measure_environment( float *temperature, float *humidity ) {
  static unsigned long measurement_timestamp = millis( );

  /* Measure once every four seconds. */
  if( millis( ) - measurement_timestamp > 3000ul )
  {
    if( dht_sensor.measure( temperature, humidity ) == true )
    {
      measurement_timestamp = millis( );
      return( true );
    }
  }

  return( false );
}



/*
 * Main program loop.
 */
void loop( ) {
  float temperature;
  float humidity;

  /* Measure temperature and humidity.  If the functions returns
     true, then a measurement is available. */
  if( measure_environment( &temperature, &humidity ) == true )
  {
    /* Serial.print( "T = " );
    Serial.print( temperature, 1 );
    Serial.print( " deg. C, H = " );
    Serial.print( humidity, 1 );
    Serial.println( "%" ); */

    char tbuff[3];
    dtostrf(temperature, sizeof(tbuff), 1, tbuff); // read and convert value
    char hbuff[3];
    dtostrf(humidity, sizeof(hbuff), 1, hbuff); // read and convert value

    Bridge.put("T", tbuff); // store the results
    Bridge.put("H", hbuff);
  }

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
