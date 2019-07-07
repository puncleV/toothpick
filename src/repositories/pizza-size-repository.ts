import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {PizzaSizeFieldsMap} from "./constants";
import {IPizzaSize, IRawPizzaSize} from "./types";

export class PizzaSizeRepository extends BaseRepository <IPizzaSize, IRawPizzaSize> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {
      entity: "pizza_size",
      mapToRawFields: PizzaSizeFieldsMap
    });
  }
}
