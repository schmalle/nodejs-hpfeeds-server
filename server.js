//
//
// simple NodeJS hp feeds server code
// written by Markus Schmall
//
//
//

var ewsParser = require("./parseEWS");
var fs = require("fs");
var put = require('put');
var binary = require('binary');
var S = require('string');
var net = require('net');
var hexdump = require('hexdump-nodejs');
var crypto = require('crypto'), shasum = crypto.createHash('sha1');

var len, type, lenIdent, lenChannel = 0, serverName, nonce;

var identifier = "HPFeedsNodeJSServer"
var payload, authHash, channel;

var clients = [];
var img = [];
var bytes;

module.exports = {



    startServer: function (port, useews, verbose, useredis) {


        //
        // Start a TCP Server
        //
        net.createServer(function (socket) {

            // Identify this client
            socket.name = socket.remoteAddress + ":" + socket.remotePort


            //
            // create initial packet from server with none
            //

            var publishLen = 4 + 1 + 1 + S(identifier).length + 4;

            var pubBuf = put()
                    .word32be(publishLen)                                               //
                    .word8(1)                                                           // INFO PACKET
                    .word8(S(identifier).length)                                        // LENGTH IDENTIFIER
                    .put(new Buffer(identifier, 'ascii'))                               // IDENTIFIER
                    // .put(Buffer.from(identifier))
                    .word32be(0x42424242)                                               // NONCE
                    .buffer()
                ;

            socket.write(pubBuf)

            // Handle incoming messages from clients.
            socket.on('data', function (data) {

                img.push(data)

                if (verbose) console.log("Recieved " + data.size + " bytes....")

            });

            //
            // Remove the client from the list when it leaves
            //
            socket.on('end', function () {

                clients.splice(clients.indexOf(socket), 1);

                bytes = Buffer.concat(img);

                var lenCompletePacket = bytes.byteLength
                var byteRunner = 0


                binary.parse(bytes)


                    .tap(function (vars2) {


                        while (byteRunner <= lenCompletePacket - 1) {

                            if (verbose) console.log("Starting scan loop at offset " + byteRunner + " from total length  " + lenCompletePacket)

                            this.word32bu('len')
                            this.word8bu('type')
                            this.word8bu('lenIdent')

                            this.tap(function (vars) {


                                this.buffer('identifier', vars.lenIdent)

                                identifier = vars.identifier
                                lenIdent = vars.lenIdent;
                                type = vars.type;


                                //
                                // check for AUTH packet
                                //
                                if (vars.type == 2) {

                                    this.buffer('authHash', 20)
                                    authHash = vars.authHash
                                    byteRunner += 6 + 20 + vars.lenIdent
                                    this.flush()
                                }

                                //
                                // check for PUBLISH packet
                                //
                                else if (vars.type == 3) {


                                    this.word8bu('lenChannel')

                                    var lenChannelPlain = vars.lenChannel.toString();
                                    var lenChannel = vars.lenChannel.toString().charCodeAt(0);

                                    this.buffer('channel', vars.lenChannel);

                                    var lenPayload = vars.len - 4 - 1 - 1 - vars.lenIdent - 1 - vars.lenChannel;

                                    this.buffer('payload', lenPayload);

                                    channel = vars.channel;
                                    payload = vars.payload;
                                    len = vars.len;

                                    byteRunner += 6 + vars.lenIdent + 1 + lenChannel + lenPayload

                                    if (useews) ewsParser.parseEWS(payload, useredis, verbose, true, false)     // for the moment use only xml parser and no json parser

                                }

                                else
                                {
                                    console.log("Error: Unknown packet found: " + bytes)
                                    byteRunner = lenCompletePacket
                                }

                                if (type == 2) {
                                    if (verbose) console.log("Auth packet with identifier: " + identifier.toString() + " and hash")
                                    if (verbose) console.log(hexdump(authHash))
                                }

                                if (type == 3) {
                                    if (verbose) console.log("   Publish packet with channel: " + channel.toString() + " and identifier " + identifier.toString() + " and len " + len.toString() + " and payload " + payload.toString())
                                    if (verbose) console.log(hexdump(payload))
                                }

                            })

                        }

                    })


            });


        }).listen(port);

        // Put a friendly message on the terminal of the server.
        if (verbose) console.log("HpFeeds server running at port " + port);

    }   // startServer function

};


