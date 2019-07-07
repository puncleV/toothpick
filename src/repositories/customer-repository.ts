import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {CustomerFieldsMap} from "./constants";
import {ICustomer, IRawCustomer} from "./types";

export class CustomerRepository extends BaseRepository <ICustomer, IRawCustomer> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {
      entity: "customer",
      mapToRawFields: CustomerFieldsMap
    });
  }
}
