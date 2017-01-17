

var redis = require("redis"),
    client = redis.createClient();

module.exports = {


    increaseKey : function (key) {

        client.incr(key)

    }

};
