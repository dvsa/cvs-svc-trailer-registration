#! /bin/sh

lsof -i:3020 | awk '{print $2}' | grep -v '^PID'
