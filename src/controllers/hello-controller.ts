import Koa from "koa";

export interface IHelloControllerDependencies {
  context: Koa.Context;
}

export class HelloController {
  private context: Koa.Context;

  constructor(dependencies: IHelloControllerDependencies) {
    this.context = dependencies.context;
  }

  public async world() {
    this.context.body = "hello world";
  }
}
