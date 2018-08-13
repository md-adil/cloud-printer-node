const { io } = require('../server.js');

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
	if(!req.file) {
		return res.status(422).send({message: 'Please select a file to print'});
	}
	printers.to(req.body.id).emit('print', req.file.buffer, {
		name: req.file.originalname,
		id: req.body.id
	});
	res.send({
		message: 'Sent to printer'
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
