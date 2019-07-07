import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {CustomerOrderFieldsMap} from "./constants";
import {ICustomerOrder, IRawCustomerOrder} from "./types";

export class CustomerOrderRepository extends BaseRepository<ICustomerOrder, IRawCustomerOrder> {
  constructor(dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {
      entity: "customer_order",
      mapToRawFields: CustomerOrderFieldsMap,
    });
  }
}
