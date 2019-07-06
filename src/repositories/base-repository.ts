import uuid from "uuid";

import {sql} from "../adapters";
import * as types from "../types";

export interface IBaseRepositoryDependencies {
  sqlConnection: sql.SqlConnection;
}

export class BaseRepository <T extends {id: string}> {
  protected sqlConnection: sql.SqlConnection;
  protected entity: string;

  constructor(dependencies: IBaseRepositoryDependencies, entity: string) {
    this.sqlConnection = dependencies.sqlConnection;
    this.entity = entity;
  }

  public async create(entity: types.Omit<T, "id">): Promise<T> {
    const id = uuid.v4();

    await this.sqlConnection.connection(this.entity).insert({
      ...entity,
      id,
    });

    return await this.findById(id);
  }

  public async find(entity: Partial<T>): Promise<T[]> {
    return await this.sqlConnection.connection(this.entity).where(entity).first();
  }

  public async findMany(entity: Partial<T>): Promise<T[]> {
    return await this.sqlConnection.connection(this.entity).where(entity);
  }

  public async update (id: string, entity: Partial<types.Omit<T, "id">>) {
    await this.sqlConnection.connection(this.entity).where({id}).update(entity);

    return this.findById(id);
  }

  public async findById (id: string) : Promise<T> {
    return await this.sqlConnection.connection(this.entity).where({id}).first();
  }
}
