

let express = require('express');
let path = require('path');

let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

const indexPath = path.join(__dirname, '/client/index.html')
const publicPath = express.static(path.join(__dirname, '/public'))

app.use('/public', publicPath)

app.get('/', function (_, res) { res.sendFile(indexPath) })

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


if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('./webpack.dev.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
}

const port = Number(process.env.PORT || 3000);

http.listen(port, function(){
  	console.log('server listening on ' + port);
});