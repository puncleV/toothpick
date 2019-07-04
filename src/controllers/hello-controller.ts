import Koa from "koa";

export class HelloController {
  public async world(ctx: Koa.Context) {
    ctx.body = "hello world";
  }
}
