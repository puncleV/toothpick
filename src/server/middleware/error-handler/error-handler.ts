import Koa from "koa";
import {ENVS_TO_SHOW_STACKTRACE} from "./constants";

export interface IErrorBody {
  message: string;
  code?: string;
  meta?: any;
  stack?: string;
}

export const errorHandler = (): Koa.Middleware => {
  const env = process.env.NODE_ENV || "development";
  const showStackTraces = ENVS_TO_SHOW_STACKTRACE.has(env);

  return async (ctx: Koa.Context, next) => {
    try {
      await next();
    } catch (err) {
      ctx.status = 500;

      const body: IErrorBody = {
        message: err.message,
      };

      if (showStackTraces) {
        body.stack = err.stack;
      }

      ctx.body = body;
    }
  };
};
