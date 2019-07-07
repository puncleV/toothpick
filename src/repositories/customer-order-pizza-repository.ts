import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {CustomerOrderPizzaFieldsMap} from "./constants";
import {ICustomerOrderPizza, IRawCustomerOrderPizza} from "./types";

export class CustomerOrderPizzaRepository extends BaseRepository<ICustomerOrderPizza, IRawCustomerOrderPizza> {
  constructor(dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {entity: "customer_order_pizza", mapToRawFields: CustomerOrderPizzaFieldsMap});
  }
}
