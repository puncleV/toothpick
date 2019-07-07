import * as repositories from "../repositories";

export interface IGetOrdersQuery {
  customerId: string;
  status:  repositories.CustomerOrderStatus;
}
