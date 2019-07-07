import Koa from "koa";

import * as services from "../services";
import {IGetOrdersQuery} from "./types";
import {DEFAULT_RESPONSE_STATUS} from "./constants";

export interface IOrderControllerDependencies {
  customerOrderFinder: services.CustomerOrderFinder;
  customerOrderTerminator: services.CustomerOrderTerminator;
}

// todo add validators (use `joi` or decorators)
export class OrderController {
  private customerOrderFinder: services.CustomerOrderFinder;
  private customerOrderTerminator: services.CustomerOrderTerminator;

  constructor(dependencies: IOrderControllerDependencies) {
    this.customerOrderFinder = dependencies.customerOrderFinder;
    this.customerOrderTerminator = dependencies.customerOrderTerminator;
  }

  public async get(ctx: Koa.Context) {
    const {query} = ctx.request;

    const customerOrders = await this.customerOrderFinder.find(query as IGetOrdersQuery);

    ctx.body = customerOrders;
  }

  public async delete (ctx: Koa.Context) {
    const {params} = ctx;

    await this.customerOrderTerminator.terminate(params.id);

    ctx.body = {
      status: DEFAULT_RESPONSE_STATUS.SUCCESS
    }
  }
}
