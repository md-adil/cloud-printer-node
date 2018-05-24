const { io } = require('../server.js'),
	fs = require('fs'),
	ss = require('socket.io-stream'),
	streamifier = require('streamifier');

const printers = io.of('/printers'),
	clients = io.of('/clients');

printers.on('connect', socket => {
	const name = socket.handshake.query.name;
	clients.emit('printer connect', { id: socket.id, name });
	socket.on('disconnect', () => {
		clients.emit('printer disconnect', socket.id);
	});
})

exports.print = (req, res) => {
	printers.emit('print', req.file.buffer, { name: req.file.originalname});
	res.send({
		status: 'ok'
	});
}

exports.index = (req, res) => {
	const activePrinters = [],
		activeSockets = Object.values(printers.sockets);
	activeSockets.forEach(socket => {
		const name = socket.handshake.query.name;
		activePrinters.push({
			id: socket.id,
			name
		});
	})

	res.send(activePrinters);
}
