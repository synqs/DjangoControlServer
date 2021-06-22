
int Temp_in = A1;
float V_out;
float Temperature;
int analogpin = 9;


//number of measurements before eval
const int nmeas = 10;

unsigned long now;
long sumval;
long vsum;
int measnum;
int lc;
int lcmax = 100;

/*working variables for PID*/
unsigned long lastTime;
double input, output, setpoint, error;
double errSum, lastErr;
double kp, ki, kd, G, tauI, tauD;

char mode;


#include <Console.h>

void setup() {
  Bridge.begin();

  while (!Console);

  Console.println("Connected.");
  
  pinMode(Temp_in,INPUT);
  pinMode(analogpin,OUTPUT);

  setpoint = 65;
   
  ////////PID parameters
  G = 3; //gain that we want to use. We find it by adjusting it to be small enough such that the system is not oscillating
  tauI = 400;// in s and obtained from the time constant as we apply a step function
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
}

void loop() {
  lc++;
  ////// measure every 10th loop cycle
  if ((lc % 1) == 0) {
    measnum++;
    V_out = analogRead(Temp_in)*(5/1024.0);
    Temperature = (V_out-1.25)/0.005; //conversion from voltage to temp // Temperature = 0.85744118 * analogRead(Temp_in) - 215.49289717;
    sumval = sumval + Temperature;
  }
  ///// if enough measurements calculate PID
  if (measnum == nmeas) {
    input = double(sumval) / double(nmeas);
    now = millis();

    //time since last evaluation
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
      if (output > 200) output = 200;
      if (output < 0) output = 0;

      //remember for next time
      lastErr = error;
      lastTime = now;
      
      Console.print("set = ");
      Console.print(setpoint);
      Console.print(", in = ");
      Console.print(input);
      Console.print(", err = ");
      Console.print(error);
      Console.print(", out = ");
      Console.println(output);
      
      /*
      if (Console.available() > 0) {
        mode = Console.read();
        if (mode == 'w') {
          Console.print("set = ");Console.print(setpoint); Console.print(", ");
          Console.print("inp = ");Console.print(input);Console.print(", ");
          Console.print("err = ");Console.print(error);Console.print(", ");
          Console.print("out = ");Console.print(output);Console.print(", ");
          Console.print("gain = ");Console.print(G);Console.print(", ");
          Console.print("ki = ");Console.print(ki);Console.print(", ");
          Console.print("kp = ");Console.println(kp);
        }
        if (mode == 's') {
          long out; setpoint = Console.parseInt();
        }
        if (mode == 'p') {
          G = Console.parseFloat();kp = G;ki = G / tauI;kd = G * tauD;
        }
        if (mode == 'i') {
          tauI = Console.parseFloat();ki = G / tauI;
        }
        if (mode == 'd') {
          tauD = Console.parseFloat();kd = G*tauD;
        }
      }
      */
    }
    analogWrite(analogpin,output);
    //reset number of aquired measurements and measurement accumulator
    sumval = 0;
    measnum = 0;
  }
  
  if (lc == lcmax) {
    lc = 0;
  }
  
  delay(50);
}
