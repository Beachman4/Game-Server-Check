var ps = require('current-processes');
var exec = require('child_process').execFile;
var config = require('config');

var Server = function() {
    var key = config.get('mailgun.key');
    var domain = config.get('mailgun.domain');
    this.applications = config.get('applications');
    this.mailgun = require('mailgun-js')({apiKey: key, domain: domain});
};

Server.prototype.runLoop = function() {
    setInterval(function() {
        this.check()
    }.bind(this), 10000);
};

Server.prototype.check = function() {
    ps.get(function(err, processes) {
        this.applications.forEach(function(item) {
            var virtual = processes.filter(function(value) {
                return value.name == item.process_name;
            });
            if (virtual.length == 0) {
                this.restart(item);
                this.sendNotification(item);
            } else {
                console.log('we gud');
            }
        }.bind(this));
    }.bind(this));
};

Server.prototype.restart = function(app) {
    exec(app.restart);
};

Server.prototype.sendNotification = function(app) {
    var data = {
        from: config.get('email_from'),
        to: config.get('email_to'),
        subject: 'Game Server Down',
        text: 'Game Server ' + app.process_name + ' went down and has been restarted.'
    }

    this.mailgun.messages().send(data);
};

var server = new Server();

server.runLoop();