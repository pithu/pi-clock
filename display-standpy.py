import RPi.GPIO as GPIO
import time, os
from threading import Event, Thread
from datetime import datetime

############################
GPIO_PIR = 23
TIMEOUT = 180 # sec

############################

GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(GPIO_PIR, GPIO.IN)

############################

class Timer(Thread):
    def __init__(self, event, callback):
        Thread.__init__(self)
        self.event = event
        self.callback = callback

    def run(self):
        while not self.event.wait(TIMEOUT):
            self.callback()

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

def move_detected(channel):
    log(f'Move detected channel {channel}')
    displayOn()

log("Display standby motion detection started")

stopFlag = Event()
Timer(stopFlag, check_move_state).start()

try:
    GPIO.add_event_detect(GPIO_PIR , GPIO.RISING, callback=move_detected)
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Goodby ...")

stopFlag.set()
GPIO.cleanup()
