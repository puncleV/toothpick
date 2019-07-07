import * as repositories from "../repositories"

export interface IFindCustomerOrderRequest {
  status?: repositories.CustomerOrderStatus;
  customerId?: string;
}

export interface IOrderPizza {
  id: string,
  count: number,
  cost: number,
}

export interface ICustomerOrder extends repositories.ICustomerOrder {
  pizzas: IOrderPizza[];
}
