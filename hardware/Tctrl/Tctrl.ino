/* Load all necessary libraries */
#include <Bridge.h>
#include <BridgeServer.h>
#include <BridgeClient.h>
#include <Process.h> // library for running processes on the linux processor

/* Define global objects */
int Temp_in = A1;
float V_out;
float Temperature;
int analogpin = 9;

const int nmeas = 10; //number of measurements before eval

unsigned long now;
long sumval;
int measnum;
int lc;
int lcmax = 100;

/* Working variables for PID */
unsigned long lastTime;
double input, output, setpoint, error;
double errSum, lastErr;
double kp, ki, kd, G, tauI, tauD;

char mode;

/* Start processes */
Process date; // process used to get the date
// Listen to the default port 5555, the Yún webserver
// will forward there all the HTTP requests you send
BridgeServer server;

/* Setup the arduino */
void setup() {
  Bridge.begin(); // setup external communication with bridge startup
  pinMode(Temp_in,INPUT); // setup pins for analog read
  pinMode(analogpin,OUTPUT);

  setpoint = 40;
   
  ////////PID parameters
  G = 5; //gain that we want to use. We find it by adjusting it to be small enough such that the system is not oscillating
  tauI = 100; // in s and obtained from the time constant as we apply a step function
  tauD = 0;
  kp = G;
  ki = G / tauI;
  kd = G*tauD;
  
  //initialize integrator
  errSum = 20 / lcmax; // let the loop start at a nice value

  lc = 0;
  measnum = 0;
  output = 0;
  sumval = 0;
  // Listen for incoming connection only from localhost
  // (no one from the external network could connect)
  server.listenOnLocalhost();
  server.begin();
}

/* Actual code */
void loop() {
  // Initialize/Update datastore key with the current pin value
  Bridge.put("setpoint", String(setpoint));
  Bridge.put("T", String(input));
  Bridge.put("error", String(error));
  Bridge.put("output", String(output));
  Bridge.put("P", String(G));
  Bridge.put("I", String(tauI));
  Bridge.put("D", String(tauD));
  
  if(!date.running()) { // check whether the process isn't running
    date.begin("date");
    date.addParameter("+%d/%m/%Y %H:%M:%S");
    date.run();
  }
  while(date.available() > 0) { // read the time given by the linux kernel
    Bridge.put("updated",date.readStringUntil('\n'));
  }
  
  // Get clients coming from server
  BridgeClient client = server.accept();

  // There is a new client?
  if (client) {
    // Process request
    // server.write("Successful write!");
    process(client);

    // Close connection and free resources.
    client.stop();
  }

  delay(50); // Poll every 50ms

  
  lc++;
  
    ////// measure every 10th loop cycle
  if ((lc % 1) == 0) {
    measnum++;
    //V_out = analogRead(Temp_in)*(5/1024.0);
    V_out = analogRead(Temp_in)*0.004953289; //new calibration
    // Temperature = (V_out-1.25)/0.005; //conversion from voltage to temp 

    Temperature = 0.85744118 * analogRead(Temp_in) - 215.49289717;
    
    sumval = sumval + Temperature;
  }
 ///// if enough measurements calculate PID
  if (measnum == nmeas) {
    input = double(sumval) / double(nmeas);
    now = millis();

    // time since last evaluation
    // we want the timeChange to be in seconds and not ms
    // this is necessary as we only know the time constant in actual units
    double timeChange = (double)((now - lastTime) / 1000);

    if (timeChange > 0) {
      //calculate error signal
      error = setpoint - input;

      //update integrator
      errSum += (error * timeChange);

      //limit the integrator to the bounds of the output
      if (errSum * ki > 255) errSum = 255 / ki;
      if (errSum * ki < 0) errSum = 0;

      //calculate derivative part
      double dErr = (error - lastErr) / timeChange;

      //compute PI output
      output = kp * error + ki * errSum+kd*dErr;
      
      //limit PID output to the bounds of the output
      if (output > 255) output = 255;
      if (output < 0) output = 0;

      //remember for next time
      lastErr = error;
      lastTime = now;
    }
    
    analogWrite(analogpin,output);
    // reset number of aquired measurements and measurement accumulator
    sumval = 0;
    measnum = 0;
  }
  
  /////////// second part of the wavepacket control
  if (lc == lcmax) {
    lc = 0;
  }
}

void process(BridgeClient client) {
  // read the command
  String command = client.readStringUntil('/');

  // is "read" command?
  if (command == "read") {
    readCommand(client);
  }
  
  // is "analog" command?
  if (command == "write") {
    analogCommand(client);
  }
}

void readCommand(BridgeClient client) { // Send feedback to client
  /* This html-like approach currently does not work. We use the key value method */
  client.println("HTTP/1.1 200 OK"); // client.println("Status: 200"); 
  client.println("Content-Type: application/xml");
  client.println("Access-Control-Allow-Origin: http://localhost:8000/");   
  client.println("Access-Control-Allow-Methods: GET, POST, PUT");
  client.println("Connection: close");  // the connection will be closed after completion of the response
  client.println(); // mandatory blank line
  client.println("Success!");
}

void analogCommand(BridgeClient client) {
  String component = client.readStringUntil('/');
  
  if (component == "setpoint") { // edit setpoint
    float value = 0;
    value = client.parseFloat();
    if (value){
      setpoint = value;      
    }
    Bridge.put("setpoint", String(setpoint)); // add some kind of confirmation?
  }
  
  if (component == "P") { // edit gain
    float value = 0;
    value = client.parseFloat();
    if (value){
      G = value;
      kp = G;
      ki = G / tauI;
      kd = G * tauD;
    }
    Bridge.put("P", String(G));
  }
  
  if (component == "I") { // edit tauI
    float value = 0;
    value = client.parseFloat();
    if (value){
      tauI = value;
      ki = G / tauI;
    }
    Bridge.put("I", String(tauI));
  }
  
  if (component == "D") { // edit tauD
    float value = 0;
    value = client.parseFloat();
    if (value){
      tauD = value;
      kd = G*tauD;
    }
    Bridge.put("D", String(tauD));
  }
}
