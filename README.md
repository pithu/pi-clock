# pi-clock

A React clock


## Autostart pi-clock on a pi

~/.config/lxsession/LXDE-pi/autostart

```shell
@xset s off
@xset -dpms
@xset s noblank
@unclutter -idle 0
@/home/pithu/Projects/pi-clock/start-server.sh /home/pithu/Projects/pi-clock/build
@chromium-browser --start-fullscreen --kiosk http://localhost:8000
```

$ sudo crontab -e 

```shell
@reboot /usr/bin/sudo /bin/chmod 666 /sys/class/backlight/rpi_backlight/bl_power
@reboot /usr/bin/sudo /home/pi/pi-clock/display-standpy.sh 
```
