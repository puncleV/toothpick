import {asValue, AwilixContainer} from "awilix";
import Koa from "koa";
import uuid from "uuid";
import {logger} from "../../logger";

export interface IRequestScopedContainerParams {
  container: AwilixContainer;
}

export const requestScopedContainer = ({container}: IRequestScopedContainerParams): Koa.Middleware => {
  return async (ctx: Koa.Context, next) => {
    const requestId = uuid.v4();
    const scopedLogger = logger.child(true, {requestId});

    const scopedContainer = container.createScope();
    scopedContainer.register({
      context: asValue(ctx),
      logger: asValue(scopedLogger),
    });

    ctx.state.container = scopedContainer;

    await next();
  };
};
