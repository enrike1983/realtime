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

// Routes

app.get('/emitter', function(req, res) {
   socket_glob.emit('evento', { hello: 'world' });
   res.render('okEvent.twig');
});
app.get('/prova', function(req, res) {
    res.render('index.twig');
});

// Routes

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port "+ app.get('port') +" in "+ app.get('env') +" mode.");
});

/*
 * Socket.IO
 */

var io = socketio.listen(server);

io.configure(function() {
    io.enable('browser client minification');
    io.set('log level', 1);
});

io.sockets.on('connection', function (socket) {
    socket_glob = socket;
    socket.emit('evento', { hello: 'world' });
    socket.on('to_server_event', function (data) {
        console.log(data);
    });
});