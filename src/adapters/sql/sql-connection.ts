import Knex from "knex";
import {ILogger} from "oddlog";
import * as util from "util";

import * as types from "../../types"

import {ISqlConfig} from "./types";

export interface ISqlBuilderDependencies {
  logger: ILogger;
  config: ISqlConfig;
}

export class SqlConnection implements types.IDisposable {
  public readonly logger: ILogger;
  public readonly connection: Knex;

  constructor({logger, config}: ISqlBuilderDependencies) {
    this.logger = logger;
    this.connection = Knex({
      client: "pg",
      connection: {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        timezone: config.timezone,
        multipleStatements: true,
      },
      pool: {
        min: 0,
        max: config.connectionLimit,
      },
    });
    this.logger.info(`initialize database connection to ${config.host}.${config.database}`)
  }

  public dispose(): Promise<void> {
    this.logger.debug(`dispose database connection`)
    return util.promisify<void>(this.connection.destroy).call(this.connection);
  }
}
