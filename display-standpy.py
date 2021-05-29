import RPi.GPIO as GPIO
import time, os
from datetime import datetime

############################
GPIO_PIR = 23

############################

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(GPIO_PIR, GPIO.IN)

############################

def log(msg):
    print(f'{datetime.now().isoformat()}: {msg}')

def displayOn():
    log("Switch display on")
    os.system("echo 0 > /sys/class/backlight/rpi_backlight/bl_power") # on

def displayOff():
    log("Switch display off")
    os.system("echo 1 > /sys/class/backlight/rpi_backlight/bl_power") # off

def check_move_state(*argv):
    movement = GPIO.input(GPIO_PIR)
    log(f'Move detect state: {movement == 1}')
    if movement == 0:
        displayOff()
    else:
        displayOn()

log("Display standby motion detection started")

try:
    GPIO.add_event_detect(GPIO_PIR , GPIO.BOTH, callback=check_move_state)
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Goodby ...")

GPIO.cleanup()
