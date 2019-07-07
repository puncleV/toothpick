import * as repositories from "../repositories"
import * as types from "../types";

export interface IFindCustomerOrderRequest {
  status?: repositories.CustomerOrderStatus;
  customerEmail?: string;
}

export interface ICustomerOrder {
  id: types.UUID;
  status: repositories.CustomerOrderStatus;
  created: types.ISO_DATE;
  delivered: types.ISO_DATE;
  customer: repositories.ICustomer;
}
