import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {ICustomer} from "./types";

export class CustomerRepository extends BaseRepository <ICustomer> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, "customer");
  }
}
