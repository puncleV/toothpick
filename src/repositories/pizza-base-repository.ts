import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {IPizzaBase} from "./types";

export class PizzaBaseRepository extends BaseRepository <IPizzaBase> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, "pizza_base");
  }
}
