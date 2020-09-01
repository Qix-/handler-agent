import { Agent, IncomingMessage, ServerResponse } from "http";

declare function handlerAgent(
	handler: (req: IncomingMessage, res: ServerResponse) => any
): Agent;

export default handlerAgent;
