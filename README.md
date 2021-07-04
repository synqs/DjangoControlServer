# DjangoControlServer
This is a minimalistic control server for small lab devices.

## goals
- [ ] implement a standardized interface to access lab devices (remote control)
- [ ] have the possiblilty to log the provided data for individual and/or a selected amount of devices at the same time
- [ ] the server should be secure

## road map/ideas
- [ ] add a modified user class (with account creation etc.)
- device classes:
	- [x] t_control
	- [x] pd_monitor
	- [ ] rp_control
- [ ] visualization with e.g. plotly
- [ ] exporting and saving data as csv
- [ ] editable home screen for monitoring several devices at the same time

## how to 
1. Download the github repo on your local computer.
	- It is recommended to use an independent virtual environment. One option is to download and install Anaconda/Miniconda (lightweight alternative). Refer to the [conda docs](https://docs.anaconda.com/anaconda/install/index.html) on how to do this exactly.
		* create a virtual environment with `conda create -n "env_name"`
		* use `conda activate "env_name"` to activate the environment 
2. Navigate to the root directory of the repo and install all required packages with `pip install -r requirements.txt`.
	- Note: If you're in the KIP, you might want to add the option `--proxy http://proxy.kip.uni-heidelberg.de:8080` right after `pip`
3. Create a superuser account by passing `python manage.py createsuperuser` to the console. In case, you already have an account, skip this step.
4. Start the server with `python manage.py runserver` and type the address `localhost:8000/admin` into you webbrowser to sign in with your account.
	- Here, you can now register or delete your lab devices. Currently supported types are temperature PID controllers and voltage monitors (for e.g. PD monitoring). The supported hardware is currently the Arduino Yún. 

For more information refer to the [Django documentation](https://docs.djangoproject.com/en/3.2/) webpage 
