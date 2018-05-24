const io = require('socket.io-client'),
	ss = require('socket.io-stream'),
	uuid = require('uuid/v1'),
	fs = require('fs'),
	os = require('os'),
	exec = require('child_process').exec;
const config = require('./config.js');

global.Promise = require('bluebird');

const writeFileAsync = Promise.promisify(fs.writeFile);

const socket = io(`${config.host}:${config.port}/printers`, {
	query: { name: os.hostname() }
});


socket.on('connect', () => {
	console.log('Connected successfully.');
});

socket.on('print', (data, obj) => {
	console.log('Printing data', obj);
	putFile(data);
});

const putFile = data => {
	const filename = __dirname + '/tmp/' + uuid() + '.png';
	writeFileAsync(filename, data)
		.then(() => {
			printTheFile(filename);
		})
		.catch(err => {
			console.log('Unable to put: ', err);
		})
}

const printTheFile = filename => {
	console.log('printing');
	// exec('lbr ' + filename, (err, data) => {
	// 	console.log(err);
	// });
}
