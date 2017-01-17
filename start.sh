#!/usr/bin/env bash
forever --sourceDir /opt/nodejs-hpfeeds/ --workingDir /opt/nodejs-hpfeeds/ -o output.log -l forever.log -e error.log start.js
