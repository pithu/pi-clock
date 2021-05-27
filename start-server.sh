#!/bin/bash

cd $1

python3 -m http.server 8000 > /dev/null 2>&1 &

sleep 1

echo "server listening on http://localhost:8000"
