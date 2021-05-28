import RPi.GPIO as GPIO
import time, os, threading
 
GPIO_PIR = 23
TIMEOUT = 180 # sec
 
 
############################
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(GPIO_PIR, GPIO.IN)
 
def displayOn():
    print("Switch display on")
    os.system("echo 0 > /sys/class/backlight/rpi_backlight/bl_power") # on

def displayOff():
    print("Switch display off")
    os.system("echo 1 > /sys/class/backlight/rpi_backlight/bl_power") # off

def startSwitchOffTimer():
    print("Will do a check_move_state in", TIMEOUT, " secs")
    threading.Timer(TIMEOUT, check_move_state).start() 

def check_move_state():
    movement = GPIO.input(GPIO_PIR)
    print("Check move state", movement == 1, time.time())
    if movement == 0:
        displayOff()
    else:
        # Wait again
        displayOn()
        startSwitchOffTimer()
 
def move_detected(channel):
    print("Move detected")
    displayOn()
    startSwitchOffTimer()

print("Display standby by motion detection")

try:
    GPIO.add_event_detect(GPIO_PIR , GPIO.RISING, callback=move_detected)
    startSwitchOffTimer()
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    print("Goodby ...")

GPIO.cleanup()
