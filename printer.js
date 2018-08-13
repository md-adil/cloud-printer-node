const io = require('socket.io-client'),
	uuid = require('uuid/v1'),
	fs = require('fs'),
	os = require('os'),
	path = require('path'),
	exec = require('child_process').exec;

const config = require('./config.js');
let domain = 'http://print.piston.work/printers';
domain = 'http://localhost:3001/printers';

global.Promise = require('bluebird');

const writeFileAsync = Promise.promisify(fs.writeFile);

const socket = io(domain, {
	query: { name: os.hostname() }
});

socket.on('connect', () => {
	console.log('Connected successfully.');
});

socket.on('print', (data, obj) => {
	console.log(obj);
	putFile(data, obj);
});

const putFile = (data, obj) => {
	const filename = __dirname + '/tmp/' + uuid() + '.' + path.extname(obj.name);
	console.log('Saving file: ', filename);
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
	exec(`print "${filename}"`, (err, data) => {
		if(err) {
			console.log(err);
		} else {
			removeFile(filename);
		}
	});
}

const removeFile = filename => {
	fs.unlink(filename, (err, res) => {
		console.log('Deleted file: ', filename);
	});
}
