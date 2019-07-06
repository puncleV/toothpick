import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {ICustomerOrder} from "./types";

export class CustomerOrderRepository extends BaseRepository <ICustomerOrder> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, "customer_order");
  }
}
