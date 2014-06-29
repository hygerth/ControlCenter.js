var express = require('express');
var jade 	= require('jade');
var http	= require('http');
var port 	= process.env.PORT || 7337;
var app		= express();
var server	= http.createServer(app);
var io		= require('socket.io').listen(server);
var exec 	= require('child_process').exec;
var devices	= [];

//app.use(express.logger('dev'));
app.use(express.bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
	io.sockets.emit('list', {devices: devices});
	socket.on('toogle', function(data) {
		var status = 'on';
		if (data.status == 'on') {
			status = 'off';
		}
		console.log(status);
		exec('tdtool --' + status + ' ' + parseInt(data.id), function(error, stdout, stderr) {});
		update();
		io.sockets.emit('list', {devices: devices});
	})
})

server.listen(port);

app.get('/', function(req, res) {
	res.render('index.jade');
})

//console.log('Starts to listen on port ' + port);

var timer = setInterval(function() {
	update();
}, 60000);

function update() {
	exec('tdtool --list', function(error, stdout, stderr) {
		devices = [];
		var devicesString = stdout.replace('\r', '').split('\n');
		for (i in devicesString) {
			var deviceParams = devicesString[i].split('\t');
			var params = {};
			if (deviceParams.length >= 3) {
				params.id = deviceParams[0];
				params.name = deviceParams[1];
				params.status = deviceParams[2];
				devices.push(params);
			}
		}
		io.sockets.emit('list', {devices: devices});
	});
}
