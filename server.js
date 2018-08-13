const express = require('express'),
	app = express(),
	server = require('http').Server(app),
	bodyParser = require('body-parser'),
	upload = require('multer')({preservePath: true}),
	config = require('./config.js'),
	io = require('socket.io')(server);

exports.io = io;

const printerController = require('./controllers/printerController.js');
require('./sockets/printer.js')(io);

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/printers/active', printerController.index);
app.post('/print', upload.single('doc'), printerController.print);

server.listen(config.port, config.host, () => {
	console.log(`Server is running on port ${config.port}`);
});
