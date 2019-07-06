import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {ICustomerOrderPizza} from "./types";

export class CustomerOrderPizzaRepository extends BaseRepository<ICustomerOrderPizza> {
  constructor(dependencies: IBaseRepositoryDependencies) {
    super(dependencies, "customer_order_pizza");
  }
}
