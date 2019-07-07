import Koa from "koa";
import _ from "lodash";

import * as repositories from "../repositories";
import * as services from "../services";
import {IOrder} from "./types";

export interface IOrderControllerDependencies {
  customerOrderFinder: services.CustomerOrderFinder;
  customerRepository: repositories.CustomerRepository;
}

export class OrderController {
  private customerOrderFinder: services.CustomerOrderFinder;
  private customerRepository: repositories.CustomerRepository;

  constructor(dependencies: IOrderControllerDependencies) {
    this.customerOrderFinder = dependencies.customerOrderFinder;
    this.customerRepository = dependencies.customerRepository;
  }

  public async get(ctx: Koa.Context) {
    // todo fix typings
    const {query} = ctx.request;

    const customerOrders = await this.customerOrderFinder.find(query);

    ctx.body = await Promise.all(customerOrders.map(async customerOrder => {
      return _.omit({
        ...customerOrder,
        customer: await this.customerRepository.findById(customerOrder.customerId)
      }, "customerId")
    })) as IOrder[];
  }
}
