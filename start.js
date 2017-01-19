//
// start a dedicated HpFeeds sever
//

var myHpFeedsServer = require ("./server");

// listen on port 10000
// use EWS parser (early warning system DTAG)
// verbosity = true
// useredis database backend
myHpFeedsServer.startServer(10000, true, true, true)
