
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

app.get('/', function(req, res){
	res.sendFile(__dirname + '/client/index.html');
});

app.get('/style', function(req, res){
	res.sendFile(__dirname + '/client/style.css');
});

app.get('/bundle', function(req, res){
	res.sendFile(__dirname + '/client/dist/bundle.js');
});

let usersOnline = [];
let socketIdUsernameMap = {};

io.on('connection', function(socket){
	
	socket.on('user', function(user) {
		console.log(user.username + ' joined');
		socketIdUsernameMap[user.socketId] = user.username;
		usersOnline.push(user.username);
		io.emit('new user', usersOnline);
	});

	socket.on('message', function(message) {
		console.log(message);
		io.emit('chat message', message);
	});

	socket.on('disconnect', function() {
		let userDisconnected = socketIdUsernameMap[socket.id];
		delete socketIdUsernameMap[socket.id];
		usersOnline.splice(userDisconnected, 1);
		console.log(userDisconnected + " left");
		io.emit('user left', usersOnline);
	})

});

const port = Number(process.env.PORT || 3000);

http.listen(port, function(){
  	console.log('server listening on ' + port);
});