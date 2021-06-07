# DjangoControlServer
This is a minimalistic control server for small lab devices.

## goals
- [ ] implement a standardized interface to access lab devices (remote control)
- [ ] have the possiblilty to log the provided data for individual and/or a selected amount of devices at the same time
- [ ] the server should be secure

## road map/ideas
- [ ] classes for admin, client and devices
- [ ] apps: temp_control, pd_monitor, rp_control

## how to
1. download the github repo on your local computer
2. navigate to the root directory of the repo
3. run `python manage.py runserver`

# install

- create a python environment like `conda -n DjangoControlServer`
- install all requirements `pip install -r requirements.txt`
- apply the necessary migrations `python manage.py migrate`
- Run the server through `python manag.py runserver`
- open under `localhost:8000/pd_monitor`

For more information refer to the [Django documentation](https://docs.djangoproject.com/en/3.2/) webpage
