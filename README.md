# DjangoControlServer
This is a minimalistic control server for small lab devices.

## road map/ideas
- device classes:
	- [x] t_control
	- [x] pd_monitor
	- [x]rp_control
	- [x] mokugo
	- [x] slackbot
	- [x] laser
- [x] visualization with e.g. plotly
- [x] exporting and saving data as csv
- [x] editable home screen for monitoring several devices at the same time
- [ ] more warnings when editing/deleting stuff
- [ ] maximum values/valid inputs for parameters
- [x] slackbot communication
- [x] laser control

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
5. To access the index of your devices, type in `localhost:8000/index`.
	- On this page, you see the lab devices registered by your account. The description as well as the IP is shown. For more details, click on the name of the respective arduino and be redirected to the detail page... 


-> The `django_activate.cmd` file can be used to shortcut to the server from the command line. Just put it into your `.../anaconda3/Scripts` folder and edit it according to the location of the git repo and the name of your anaconda environment.

For more information refer to the [Django documentation](https://docs.djangoproject.com/en/3.2/) webpage 
