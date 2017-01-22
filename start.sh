#!/usr/bin/env bash

#
# start script for foever
#

forever --sourceDir /opt/nodejs-hpfeeds-server/ --workingDir /opt/nodejs-hpfeeds-server/ -o output.log -l forever.log -e error.log start.js
