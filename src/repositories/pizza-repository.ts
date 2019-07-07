import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {PizzaFieldsMap} from "./constants";
import {IPizza, IRawPizza} from "./types";

export class PizzaRepository extends BaseRepository<IPizza, IRawPizza> {
  constructor(dependencies: IBaseRepositoryDependencies) {
    super(dependencies, {
      entity: "pizza",
      mapToRawFields: PizzaFieldsMap,
    });
  }
}
