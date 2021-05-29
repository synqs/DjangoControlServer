from django.db import models
from django.utils import timezone

# Create your models here.
class WebTempControl(models.Model):
	id = models.IntegerField(primary_key=True)

	name = models.CharField(max_length=50)
	sleeptime = models.FloatField(default=100)

	ip_address = models.CharField(max_length=50)
	port = models.CharField(max_length=4)
	user_id = models.ForeignKey(user.id)

	setpoint = models.FloatField(default=0)
	value = models.FloatField(default=0)
	output = models.FloatField(default=0)
	error = models.FloatField(default=0)

	gain = models.FloatField(default=0)
	integral = models.FloatField(default=0)
	diff = models.FloatField(default=0)

	timestamp = models.DateTimeField(default=timezone.now())

	timeout = 5

	def __str__(self):
		return self.name+', '+self.sleeptime

	def __http_str__(self):
		return 'http://' + self.ip_address + ':' + self.port

	'''
	def connection_open(self):                              # Do we need this ?
        # Is the protocol running ?
        	return self.is_alive() and self.is_open()

	def is_open(self):
        # test if the serial connection is open
		try:
            		proxies = {
                		'http': None,
                		'https': None,
                		}
            		r = requests.get(self.http_str(), timeout =self.timeout, proxies=proxies);
            		return True
        	except ConnectionError:
            		return False

    	def pull_arduino(self):
        # pulling the actual data from the arduino
        	try:
            		proxies = {
            			'http': None,
            			'https': None,
            			}
            		r = requests.get(self.temp_http_str(), timeout =self.timeout, proxies=proxies)
        	except ConnectionError:
            		print('No connection')
            		return 0, 0
        	html_text = r.text
        	lines = html_text.split('<br />')
        	self.ard_str = lines[1]

        	vals = self.ard_str.split(',')
        	if len(vals)==7:
          		self.setpoint = vals[0]
            		self.value = vals[1]
            		self.error = vals[2]
            		self.output = vals[3]
            		self.gain = vals[4]
            		self.integral = vals[5]
            		sp_vals = vals[6].split('\r')
            		self.diff = sp_vals[0]
            		self.timestamp = datetime.now().replace(microsecond=0)
            		db.session.commit()

    	def temp_value(self):
        	vals = self.ard_str.split(',')
        	if len(vals) >=2 :
            		return vals[1]
        	else:
            		return 0

    	def start(self):
        # start to listen to the serial port of the Arduino & test if everything is open
        	if not self.is_open():
            		print('No connection')
            		return

        	self.switch = True
        	
		# configure the arduino
		if self.setpoint:
            		self.set_setpoint()
        		time.sleep(0.2)
        	if self.gain:
            	self.set_gain()
        		time.sleep(0.2)
        	if self.integral:
            		self.set_integral()
        		time.sleep(0.2)
        	if self.diff:
            		self.set_differential()
        		db.session.commit()

    	def stop(self):
        # stop the connection
        	self.switch = False
        	db.session.commit()

    	def set_setpoint(self):
        	try:
            		set_str = '/arduino/write/setpoint/' + str(self.setpoint) + '/'
            		addr = self.__http_str__() + set_str
            		proxies = {
                		'http': None,
                		'https': None,
                		}
            		r = requests.get(addr, timeout =self.timeout, proxies=proxies)
            		return r.ok
        	except ConnectionError:
            		return False

    	def set_gain(self):
        	try:
            		proxies = {
                		'http': None,
                		'https': None,
                		}

            		set_str = '/arduino/write/gain/' + str(self.gain) + '/'
            		addr = self.__http_str__() + set_str
            		r = requests.get(addr, timeout = self.timeout, proxies=proxies)
            		return r.ok
        	except ConnectionError:
            		return False

    	def set_integral(self):
        	try:
            		proxies = {
                		'http': None,
                		'https': None,
                		}
            		set_str = '/arduino/write/integral/' + str(self.integral) + '/'
            		addr = self.__http_str__() + set_str
            		r = requests.get(addr, timeout = self.timeout, proxies=proxies)
            		return r.ok
        	except ConnectionError:
            		return False

    	def set_differential(self):
        	try:
            		proxies = {
                		'http': None,
                		'https': None,
                	}
            		set_str = '/arduino/write/differential/' + str(self.diff) + '/'
            		addr = self.__http_str__() + set_str
            		r = requests.get(addr, timeout = self.timeout, proxies=proxies)
            		return r.ok
        	except ConnectionError:
            		return False 