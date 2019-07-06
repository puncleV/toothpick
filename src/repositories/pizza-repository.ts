import {BaseRepository, IBaseRepositoryDependencies} from "./base-repository";
import {IPizza} from "./types";

export class PizzaRepository extends BaseRepository <IPizza> {
  constructor (dependencies: IBaseRepositoryDependencies) {
    super(dependencies, "pizza");
  }
}
