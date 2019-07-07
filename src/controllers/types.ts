import * as repositories from "../repositories";
import * as types from "../types";

export interface IOrder extends types.Omit<repositories.ICustomerOrder, "customerId"> {
  customer: repositories.ICustomer
}
