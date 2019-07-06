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
  delivered: types.ISO_DATE;
  customerId: ICustomer["id"];
}

export interface ICustomerOrderPizza {
  id: types.UUID;
  customerOrderId: ICustomerOrder["id"];
  pizzaId: IPizza["id"];
  count: number;
}
