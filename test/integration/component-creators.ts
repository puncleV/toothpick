import {database} from "../../configs/config.json";
import {sql} from "../../src/adapters";
import {logger} from "../../src/logger";
import * as repositories from "../../src/repositories";

export const createSqlConnection = (overrides: Partial<sql.ISqlBuilderDependencies> = {}) => {
  return new sql.SqlConnection({
    logger: overrides.logger || logger.child(true),
    config: overrides.config || database,
  });
};

export const createCustomerRepository = (overrides: Partial<repositories.IBaseRepositoryDependencies> = {}) =>
  new repositories.CustomerRepository({
    sqlConnection: overrides.sqlConnection || createSqlConnection(),
  });
export const createCustomerOrderRepository = (overrides: Partial<repositories.IBaseRepositoryDependencies> = {}) =>
  new repositories.CustomerOrderRepository({
    sqlConnection: overrides.sqlConnection || createSqlConnection(),
  });
