#!/bin/bash

cmdLine="ps -efa | grep nodejs | wc -l";
cmdLine="/opt/nodejs-hpfeeds-server/corecheck.sh";

number=$(eval $cmdLine);

echo "Number: $number"

case $number in

2)  echo "All OK";
    ;;

1)  echo "NodeJS Feeds server not running"
    cd /opt/nodejs-hpfeeds-server
    nodejs start.js >> /var/log/hpfeeds.log &
    ;;
*)  echo "Unknown situation"
    ;;
esac
