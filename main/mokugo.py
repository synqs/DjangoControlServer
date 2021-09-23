from moku.instruments import PIDController
from moku.instruments import Oscilloscope

def mokugo_data(ip):
	# Connect to your Moku by its ip address using Oscilloscope('192.168.###.###')
	i = Oscilloscope(ip, force_connect=True)
	
	# Set the data source of Channel 1 to be Input 1
    i.set_source(1, 'Input1')

    # Set the data source of Channel 2 to the generated output sinewave
    i.set_source(2, 'Input2')
	
	# Fetch data for one time
	data = i.get_data()
	
	return data