import {container} from "./container";
import {logger} from "./logger";
import {createServer} from "./server";

logger.info("Starting the API...");

export const server = createServer(container);
