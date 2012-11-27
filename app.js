var express = require('express'),
    request = require('request');

var app = express.createServer();

app.use(express.favicon());
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());

function casLogin(casProvider, username, password, service, callback) {
    //Get the login ticket from the login page
    function getLoginTicket(casProvider, service, callback) {
        request.get(casProvider + "?service=" + encodeURIComponent(service), function (error, result, body) {
            var re = /"(LT-[\w|\d]+)"/,
                match = re.exec(body);
            if(match === null){
                callback(true);
            } else {
                callback(false, match[1]);
            }
            
        })
    }

    //Make a login request
    function postLogin(casProvider, username, password, service, loginTicket, callback) {
        request.post(casProvider,{
            form: {
                username: username,
                password: password,
                service: service,
                lt: loginTicket
            }
        }, function (error, response, body) {
            callService();
        });
    }

    //Call the service url to set the cookie
    function callService() {
        request.get(response.headers.location, 
            function (err, response, body) {
                callback();
        });
    }

    getLoginTicket(casProvider, service, function (fallThrough, loginTicket) {
        if(fallThrough) {
            callback();
        } else {
            postLogin(casProvider, username, password, service, loginTicket, callback);
        }
    });
}



app.get('/', function(req, res){
    var casProvider = 'https://login-url';
    //var service = 'http://mpie-sm4.ch.flipkart.com:35221';
    var service = 'http://client-url';
    
    var username = 'usename';
    var password = 'password';
    casLogin(casProvider, username, password, service, function () { 
        console.log("Successfully logged in");
    });
    res.send('This is a page.');
});

app.listen(3000);
console.log('Express app started on port 3000');