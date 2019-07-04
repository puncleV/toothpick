import Koa from "koa";
import Router from "koa-router";
import {ICreateRouterParams} from "./types";

const ROUTE_REG_EXP = /^(get|put|post|patch|delete)\s(\S+)$/i;
const ACTION_REG_EXP = /^(.+Controller)#(.+)$/;

export function createRequestRouter({routes}: ICreateRouterParams): Router {
  const router = new Router();

  Object.keys(routes).forEach((key) => {
    const routeMatch = ROUTE_REG_EXP.exec(key);

    if (routeMatch == null) {
      const message = `Route definition string is wrong: "${key}". It must match: ${ROUTE_REG_EXP}`;
      throw new Error(message);
    }

    const method = routeMatch[1];
    const path = routeMatch[2];

    const value = routes[key];
    const actionMatch = ACTION_REG_EXP.exec(value);

    if (actionMatch == null) {
      const message = `Action definition string is wrong: "${value}". It must match: ${actionMatch}`;
      throw new Error(message);
    }

    const controller = actionMatch[1];
    const action = actionMatch[2];

    const handler = Reflect.get(router, method.toLowerCase());
    handler.call(router, path, async (ctx: Koa.Context, next: () => Promise<any>) => {
      const scopedContainer = ctx.state.container;

      const controllerInstance = scopedContainer.resolve(controller);
      const controllerAction = Reflect.get(controllerInstance, action);
      await controllerAction.call(controllerInstance, ctx);
    });
  });

  return router;
}
