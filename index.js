const http = require('http');
const stream = require('stream');

const makePipe = () => {
	const client = new stream.Duplex({
		allowHalfOpen: false
	});
	const server = new stream.Duplex({
		allowHalfOpen: false
	});

	client._read = () => {};
	server._read = () => {};

	client._write = (chunk, _, cb) => {
		server.push(chunk);
		cb();
	};

	server._write = (chunk, _, cb) => {
		client.push(chunk);
		cb();
	};

	return {client, server};
};

module.exports = handler => {
	const server = new http.Server();
	server.on('request', handler);

	const agent = new http.Agent();
	agent.createConnection = () => {
		const pipe = makePipe();
		server.emit('connection', pipe.server);
		return pipe.client;
	};

	return agent;
};
