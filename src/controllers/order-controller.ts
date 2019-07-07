import Koa from "koa";

import * as services from "../services";
import {IGetOrdersQuery} from "./types";

export interface IOrderControllerDependencies {
  customerOrderFinder: services.CustomerOrderFinder;
}

export class OrderController {
  private customerOrderFinder: services.CustomerOrderFinder;

  constructor(dependencies: IOrderControllerDependencies) {
    this.customerOrderFinder = dependencies.customerOrderFinder;
  }

  public async get(ctx: Koa.Context) {
    // todo fix typings
    const {query} = ctx.request;

    const customerOrders = await this.customerOrderFinder.find(query as IGetOrdersQuery);

    ctx.body = customerOrders;
  }
}
