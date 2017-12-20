#!/usr/bin/env bash

#
# start script for foever
#

forever --sourceDir $(pwd) --workingDir $(pwd) -o output.log -l forever.log -e error.log start.js
