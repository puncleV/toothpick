import {asClass, createContainer} from "awilix";

import config from "../configs/config.json";
import * as adapters from "./adapters";
import * as controllers from "./controllers";
import * as repositories from "./repositories";
import * as services from "./services";

export const container = createContainer().register({
  OrderController: asClass(controllers.OrderController),

  customerOrderFinder: asClass(services.CustomerOrderFinder),

  customerOrderRepository: asClass(repositories.CustomerOrderRepository),
  customerRepository: asClass(repositories.CustomerRepository),
  pizzaRepository: asClass(repositories.PizzaRepository),
  customerOrderPizzaRepository: asClass(repositories.CustomerOrderPizzaRepository),

  sqlConnection: asClass(adapters.sql.SqlConnection).inject(() => ({
    config: config.database
  })).singleton(),
});
