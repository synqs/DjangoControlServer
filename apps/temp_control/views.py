from django.shortcuts import render
'''
class UpdateForm(FlaskForm):
	# view for connecting to the Arduino
	id = HiddenField('A hidden field')
	serial_port = StringField('Update to port:', validators=[DataRequired()])
	submit = SubmitField('Update port')

class WebUpdateForm(FlaskForm):
	# view for connecting to the WebArduino
	id = HiddenField('A hidden field')
	ip_adress = StringField('Update to IP:', validators=[DataRequired()])
	port = IntegerField('Update to port:')
	submit = SubmitField('Update connection')

class SerialWaitForm(FlaskForm):
	# view for connecting to the Arduino
	id = HiddenField('A hidden field')
	serial_time = IntegerField('Time between measurements (s):', [DataRequired(), NumberRange(2,300)])
	submit = SubmitField('Update waiting time.')

class UpdateSetpointForm(FlaskForm):
	# view for connecting to the Arduino
	id = HiddenField('A hidden field')
	setpoint = IntegerField('New setpoint:', [DataRequired(), NumberRange(0,1023)])
	submit = SubmitField('Update setpoint')

class UpdateGainForm(FlaskForm):
	# view for updateing the gain of the Arduino
	id = HiddenField('A hidden field')
	gain = FloatField('New gain:', [DataRequired(), NumberRange(0)])
	submit = SubmitField('Update gain')

class UpdateIntegralForm(FlaskForm):
	# view for updating the integral part to the Arduino
	id = HiddenField('A hidden field')
	tau = FloatField('New tauI in seconds:', [DataRequired(), NumberRange(1)])
	submit = SubmitField('Update time constant')

class UpdateDifferentialForm(FlaskForm):
	# view for updating the differential part of the Arduino	
	id = HiddenField('A hidden field')
	tau = FloatField('New tauD in seconds:', [DataRequired(), NumberRange(0)])
	submit = SubmitField('Update tauD')
'''
class ConnectForm(FlaskForm):
	# view for connecting to the Arduino
	id = HiddenField('A hidden field')
	serial_port = StringField('Connect on port:', validators=[DataRequired()], description = 'Serial port')
	name = StringField('Name of the Arduino:', description = 'Name', default = 'Arduino')
	submit = SubmitField('Connect')

class WebConnectForm(FlaskForm):
	# view for connecting to the Arduino
	id = HiddenField('A hidden field')
	ip_adress = StringField('Connect to IP:', validators=[DataRequired()], description = 'IP Adress')
	port = IntegerField('Port:', description = 'Port')
	name = StringField('Name of the Arduino:', description = 'Name', default = 'Arduino')
	submit = SubmitField('Connect')

class DisconnectForm(FlaskForm):
	# view for disconnecting from the Arduino
	id = HiddenField('A hidden field')
	submit = SubmitField('Disconnect')