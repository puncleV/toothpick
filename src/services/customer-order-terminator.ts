import * as repositories from "../repositories";
import {ORDER_STATUS_AVAILABLE_TO_TERMINATE} from "./constants";
import {OrderItems} from "./order-items";

export interface ICustomerOrderTerminatorDependencies {
  customerOrderRepository: repositories.CustomerOrderRepository;
  orderItems: OrderItems;
}

export class CustomerOrderTerminator {
  private customerOrderRepository: repositories.CustomerOrderRepository;
  private orderItems: OrderItems;

  constructor (dependencies: ICustomerOrderTerminatorDependencies) {
    this.customerOrderRepository = dependencies.customerOrderRepository;
    this.orderItems = dependencies.orderItems;
  }

  public async terminate (orderId: string) {
    const customerOrder = await this.customerOrderRepository.findById(orderId);

    if (customerOrder == null) {
      // todo typed error
      throw new Error("Requested order not found");
    }

    if (!ORDER_STATUS_AVAILABLE_TO_TERMINATE.has(customerOrder.status)) {
      // todo typed error
      throw new Error(`Cant cancel order in ${customerOrder.status} status`);
    }

    await this.orderItems.clearByOrderId(orderId);
  }

}
