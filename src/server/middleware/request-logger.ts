import Koa from "koa";
import {Stream} from "stream";

export const requestLogger = (): Koa.Middleware => {
  return async (ctx, next) => {
    const logger = ctx.state.container.resolve("logger");

    const start = Date.now();
    logger.info(`--> ${ctx.method} ${ctx.originalUrl}`);

    let done: () => void;
    done = () => {
      ctx.res.removeListener("finish", done);
      ctx.res.removeListener("close", done);

      // Don't log Stream objects
      const body = ctx.response.body instanceof Stream ? undefined : ctx.response.body;

      const executionTime = Date.now() - start;
      logger.info(
        `<-- ${ctx.method} ${ctx.originalUrl}`,
        {body},
        {
          status: ctx.status,
          time: `${executionTime}ms`,
          url: ctx.originalUrl,
        },
      );
    };

    ctx.res.once("finish", done);
    ctx.res.once("close", done);

    await next();
  };
};
