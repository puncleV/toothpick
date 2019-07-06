import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {IPizzaSize} from "./types";

export class PizzaSizeRepository extends BaseRepository <IPizzaSize> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, "pizza_size");
  }
}
