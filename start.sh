#!/usr/bin/env bash
forever --sourceDir /opt/nodejs-hpfeeds-server/ --workingDir /opt/nodejs-hpfeeds-server/ -o output.log -l forever.log -e error.log start.js
