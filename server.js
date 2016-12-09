var ps = require('current-processes');
var exec = require('child_process').execFile;
var config = require('config');

var Server = function() {
    var key = config.get('mailgun.key');
    var domain = config.get('mailgun.domain');
    this.mailgun = require('mailgun-js')({apiKey: key, domain: domain});
};

Server.prototype.runLoop = function() {
    setInterval(function() {
        this.check()
    }.bind(this), 10000);
};

Server.prototype.check = function() {
    ps.get(function(err, processes) {
        var virtual = processes.filter(function(value) {
            return value.name == 'FTBServer';
        });
        if (virtual.length == 0) {
            this.restart();
            this.sendNotification();
        } else {
            console.log('we gud');
        }
    }.bind(this));
};

Server.prototype.restart = function() {

};

Server.prototype.sendNotification = function() {
    console.log("send some stuff");
};

var server = new Server();

server.runLoop();