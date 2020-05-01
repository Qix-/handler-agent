# `handler-agent`

`handler-agent` creates a connection `http.Agent` usable by most HTTP clients that
executes an HTTP handler (`function (req, res) { res.end('hi') }`) instead of
creating a network connection.

The returned agent can be used by `http.request()`, [`got`](https://npmjs.org/package/got),
and most other Node.js HTTP clients that support the use of `http.Agent`s.

This is primarily useful for testing HTTP APIs without touching the network.

## Usage

```console
npm install --save handler-agent
```

```javascript
const handlerAgent = require('handler-agent');

const myHttpHandler = (req, res) => {
	if (req.url === '/' && req.method === 'GET') {
		res.writeHead(200);
		res.end('Hello, world!');
	} else {
		res.writeHead(404);
		res.end('Not Found');
	}
};

const agent = handlerAgent(myHttpHandler);

const got = require('got').extend({
	agent: {
		http: agent,
		https: agent
	}
});

got.get('http://localhost/')
	.then(response => {
		console.log('GET /: Got response:', response.body);
	});

got.post('http://localhost/foo')
	.catch(err => {
		console.error('POST /foo:', err.stack);
	});
```

Output:

```
GET /: Got response: Hello, world!
POST /foo: HTTPError: Response code 404 (Not Found)
    at PromisableRequest.<anonymous> (/src/qix-/handler-agent/node_modules/got/dist/source/as-promise/index.js:124:28)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
```

## But why?

Testing an HTTP API in modern tooling seems to fall in two extremes; you either use
a bloated framework and desktop client, or you roll your own testing suite from scratch.

For me personally, I like rolling my own as I tend to put myself in unique scenarios that
don't quite fit into the nicely specified boxes the larger frameworks prescribe.

This module is a good middleground; I'm able to use `async`/`await` with my favorite HTTP
request library (e.g. `got`) without having to start a real TCP server and deal with all of
the fragility that comes with it.

Using `handler-agent` prevents network issues such as re-used ports, latency (yes, really),
managing port/host configuration, as well as removing the need for DNS lookups, modifying
`/etc/hosts` just to test the `Host` header, etc.

# License

Copyright &copy; 2020 by Josh Junon.
Released under the [MIT License](LICENSE.txt).
