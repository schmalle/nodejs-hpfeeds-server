#HPFeeds NodeJS Server NPM Module

Hp Feeds (see https://github.com/rep/hpfeeds) is the transport protocol for 
various honeypots.

For testing:

Copy the /test/request* files to /opt and start with start.sh

Stores per hours port counter in Redis DB (optional)

Install hints:

libxmljs installation seems to be interesting for a number of plattforms.

To get it working install node-gyp

npm install -g node-gyp

If your system complains that node or nodejs is not existing, ensure that
you set the right symbolic links depending on your environment / nodejs
installation method.

If you cannot find libxmljs bindings, this should help

$ sudo npm install -g node-gyp
$ cd node_modules/libxmljs
$ node-gyp rebuild



Contact:

EMail: markus_@_mschmall_._de

Twitter: @flakdev
