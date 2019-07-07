import casual from "casual";

import * as repositories from "../../src/repositories"
import {createPizzaRepository} from "./component-creators";

export const createPizza = async (overrides: Partial<repositories.IPizza> = {}) => {
  const pizzaRepo = createPizzaRepository();

  return await pizzaRepo.create({
    name: casual.word,
    description: casual.string,
    cost: casual.integer(1, 1000),
    ...overrides,
  })
}
