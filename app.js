var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
let port = process.env.PORT || 3000;
app.set('view engine', 'ejs');

http.listen(port, function () {
    console.log('Server running on port ' + port);
});

app.get('/', function (req, res) {
    res.render('index');
});

io.on('connection', function (socket) {
    socket.on('draw', function (data) {
        socket.broadcast.emit('draw', data);
    });

    socket.on('clear', function () {
        socket.broadcast.emit('clear');
    });

    socket.on('mouse_up', function () {
        socket.broadcast.emit('mouse_up');
    });

    socket.on('mouse_down', function () {
        socket.broadcast.emit('mouse_down');
    });

    socket.on('message', function (data) {
        socket.broadcast.emit('message', data);
    });
});

