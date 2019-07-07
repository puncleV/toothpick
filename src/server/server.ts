import {AwilixContainer} from "awilix";
import Koa from "koa";
import bodyParser from "koa-bodyparser";

import {initShutdownHandler} from "../shutdown-handler";
import * as middleware from "./middleware";
import {createRequestRouter} from "./request-router";
import {routes} from "./routes";

export const createServer = (container: AwilixContainer) => {
  const application = new Koa();

  application.use(middleware.errorHandler());
  application.use(middleware.requestScopedContainer({container}));
  application.use(middleware.registerLogger());
  application.use(middleware.requestLogger());
  application.use(bodyParser());

  const requestRouter = createRequestRouter({routes});
  application.use(requestRouter.routes());
  application.use(requestRouter.allowedMethods());

  // todo use config
  const server = application.listen(1337);
  initShutdownHandler(server);

  return server;
};
