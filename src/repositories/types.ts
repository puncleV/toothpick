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

export interface IPizzaBase {
  id: types.UUID;
  name: string;
}

export interface IPizzaSize {
  id: types.UUID;
  name: string;
}

export interface IPizza {
  id: types.UUID;
  name:  string;
  size: IPizzaSize["id"];
  base: IPizzaBase["id"];
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

export interface IRawPizzaBase {
  id: types.UUID;
  name: string;
}

export interface IRawPizzaSize {
  id: types.UUID;
  name: string;
}

export interface IRawPizza {
  id: types.UUID;
  name:  string;
  size: IRawPizzaSize["id"];
  base: IRawPizzaBase["id"];
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
