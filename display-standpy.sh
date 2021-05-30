#!/bin/bash

cd "$(dirname "$0")"

/usr/bin/python3 ./display-standpy.py  >> /var/log/display-standpy.log 2>&1
