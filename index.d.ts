import { Agent, IncomingMessage, ServerResponse } from 'node:http';

declare function handlerAgent(
	handler: (req: IncomingMessage, res: ServerResponse) => any
): Agent;

export default handlerAgent;
