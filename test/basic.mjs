import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import got from 'got';
import handlerAgent from '../index.cjs';

describe('basic (default) handler', () => {
	it('should respond synchronously', async () => {
		const { body, statusCode } = await got.get('http://localhost:80/', {
			agent: {
				http: handlerAgent((_, res) => {
					res.writeHead(200);
					res.end('hello!');
				})
			}
		});

		assert.equal(statusCode, 200);
		assert.equal(body, 'hello!');
	});

	it('should respond asynchronously', async () => {
		const { body, statusCode } = await got.get('http://localhost:80/', {
			agent: {
				http: handlerAgent(async (_, res) => {
					await new Promise(resolve => setTimeout(resolve, 10));
					res.writeHead(200);
					res.end('hello!');
				})
			}
		});

		assert.equal(statusCode, 200);
		assert.equal(body, 'hello!');
	});
});
