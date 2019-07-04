import {AwilixContainer} from "awilix";
import Koa from "koa";

export interface IRequestScopedContainerParams {
  container: AwilixContainer;
}

export const requestScopedContainer = ({container}: IRequestScopedContainerParams): Koa.Middleware => {
  return async (ctx: Koa.Context, next) => {
    const scopedContainer = container.createScope();

    ctx.state.container = scopedContainer;

    await next();
  };
};
