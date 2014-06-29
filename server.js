var express 	= require('express');
var bodyParser 	= require('body-parser');
var jade 		= require('jade');
var http		= require('http');
var port 		= process.env.PORT || 7337;
var app			= express();
var server		= http.createServer(app);
var io			= require('socket.io').listen(server);
var exec 		= require('child_process').exec;

//app.use(express.logger('dev'));
app.use(bodyParser());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

io.sockets.on('connection', function(socket) {
	var devices = listDevices();
	io.sockets.emit('list', {devices: devices});
	socket.on('toogle', function(data) {
		var status = toggleStatus(data.status);
		setDevice(data.id, status);
		var devices = listDevices();
		io.sockets.emit('list', {devices: devices});
	});
});

server.listen(port);

app.route('/')
	.get(function(req, res) {
		res.render('index.jade');
	});

app.route('/:id/:status')
	.get(function(req, res) {
		var id = req.params.id;
		var status = req.params.status;
		setDevice(id, status);
		res.json({message: 'Device ' + id + ' turned ' + status});
	});

app.route('/list')
	.get(function(req, res) {
		var devices = listDevices();
		res.json({devices: devices});
	});

//console.log('Starts to listen on port ' + port);

var timer = setInterval(function() {
	var devices = listDevices();
	io.sockets.emit('list', {devices: devices});
}, 60000);

function toggleStatus(status) {
	if (status === 'on') {
		return 'off';
	} else {
		return 'on';
	}
}

function setDevice(id, status) {
	exec('tdtool --' + status + ' ' + parseInt(id), function(error, stdout, stderr) {});
}

function listDevices() {
	exec('tdtool --list', function(error, stdout, stderr) {
		var list = [];
		var devicesString = stdout.replace('\r', '').split('\n');
		for (var i in devicesString) {
			var deviceParams = devicesString[i].split('\t');
			var params = {};
			if (deviceParams.length >= 3) {
				params.id = deviceParams[0];
				params.name = deviceParams[1];
				params.status = deviceParams[2];
				list.push(params);
			}
		}
		return list;
	});
}
