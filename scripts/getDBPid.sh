#! /bin/sh

lsof -i:8020 | awk '{print $2}' | grep -v '^PID'
