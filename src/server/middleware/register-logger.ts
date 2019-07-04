import {asValue} from "awilix";
import Koa from "koa";
import uuid from "uuid";
import {logger} from "../../logger";

export const registerLogger = (): Koa.Middleware => {
  return async (ctx: Koa.Context, next) => {
    const {container} = ctx.state;
    const requestId = uuid.v4();
    const scopedLogger = logger.child(true, {requestId});

    container.register({
      logger: asValue(scopedLogger),
    });

    await next();
  };
};
