import * as types from "../types";

export enum CustomerOrderStatus {
  PENDING = "pending",
  PREPARING = "preparing",
  TRANSIT = "transit",
  DELIVERED = "delivered",
}

export interface ICustomer {
  id: types.UUID;
  name: string;
  email: string;
}

export interface IPizza {
  id: types.UUID;
  name:  string;
  description: string;
  cost: number;
}

export interface ICustomerOrder {
  id: types.UUID;
  status: CustomerOrderStatus;
  created: types.ISO_DATE;
  delivered?: types.ISO_DATE;
  customerId: ICustomer["id"];
}

export interface ICustomerOrderPizza {
  id: types.UUID;
  customerOrderId: ICustomerOrder["id"];
  pizzaId: IPizza["id"];
  count: number;
}


export interface IRawCustomer {
  id: types.UUID;
  name: string;
  email: string;
}

export interface IRawPizza {
  id: types.UUID;
  name:  string;
  description: string;
  cost: number;
}

export interface IRawCustomerOrder {
  id: types.UUID;
  status: CustomerOrderStatus;
  created: types.ISO_DATE;
  delivered: types.ISO_DATE;
  customer_id: IRawCustomer["id"];
}

export interface IRawCustomerOrderPizza {
  id: types.UUID;
  customer_order_id: IRawCustomerOrder["id"];
  pizza_id: IPizza["id"];
  count: number;
}
