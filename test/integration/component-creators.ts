import {database} from "../../configs/config.json";
import {sql} from "../../src/adapters";
import {logger} from "../../src/logger";

export const createSqlConnection = (overrides: Partial<sql.ISqlBuilderDependencies> = {}) => {
  return new sql.SqlConnection({
    logger: overrides.logger || logger.child(true),
    config: overrides.config || database,
  });
}
