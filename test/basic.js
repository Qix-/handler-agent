const assert = require('assert').strict;
const got = require('got');
const handlerAgent = require('..');

const eq = assert.deepEqual;

exports.basic = async () => {
	const { body, statusCode } = await got.get('http://localhost:80/', {
		agent: {
			http: handlerAgent((_, res) => {
				res.writeHead(200);
				res.end('hello!');
			})
		}
	});

	eq(statusCode, 200);
	eq(body, 'hello!');
};

exports.asyncBasic = async () => {
	const { body, statusCode } = await got.get('http://localhost:80/', {
		agent: {
			http: handlerAgent(async (_, res) => {
				await new Promise(resolve => setTimeout(resolve, 10));
				res.writeHead(200);
				res.end('hello!');
			})
		}
	});

	eq(statusCode, 200);
	eq(body, 'hello!');
};
