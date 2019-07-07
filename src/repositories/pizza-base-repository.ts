import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {PizzaBaseFieldsMap} from "./constants";
import {IPizzaBase, IRawPizzaBase} from "./types";

export class PizzaBaseRepository extends BaseRepository<IPizzaBase, IRawPizzaBase> {
  constructor(dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {
      entity: "pizza_base",
      mapToRawFields: PizzaBaseFieldsMap,
    });
  }
}
