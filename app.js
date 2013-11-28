var config = require('./config');
var express = require('express'),
    socketio = require('socket.io'),
    http = require('http'),
    path = require('path');

var app = express();
var socket_glob;

// Configuration
app.configure(function(){
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'twig');
    app.set('twig options', {
        strict_variables: false,
        cache: false,
        auto_reload: true
    });
    app.use(express.favicon());
    app.use(express.logger('short'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
    app.use(express.errorHandler());
});

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port "+ app.get('port') +" in "+ app.get('env') +" mode.");
});

/******************************************************************/

//Socket.io init
var io = socketio.listen(server);

// removed logging
io.configure(function() {
    io.enable('browser client minification');
    io.set('log level', 1);
});

/******************************************************************/

// Routes
app.get('/arduino', function(req, res) {

    remote_temp = req.query.t;
    remote_hum = req.query.h;

    console.log('sending data to frontend client...');

    io.sockets.in(req.sessionID).emit('evento', { temp: remote_temp, hum: remote_hum });
    res.send(200);
});
app.get('/prova', function(req, res) {

    console.log('rendering frontend client...');

    res.render('index.twig', { server: config.server_IP });
});