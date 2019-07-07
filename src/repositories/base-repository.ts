import uuid from "uuid";

import {sql} from "../adapters";
import * as types from "../types";

export interface IBaseRepositoryDependencies {
  sqlConnection: sql.SqlConnection;
}

export interface IBaseRepositoryParams<T, Q> {
  entity: string;
  mapToRawFields: Map<keyof T, keyof Q>,
}

export class BaseRepository <T extends {id: string}, Q> {
  protected sqlConnection: sql.SqlConnection;
  protected entity: string;
  protected mapToBaseFields: Map<keyof T, keyof Q>;

  constructor(dependencies: IBaseRepositoryDependencies, params: IBaseRepositoryParams<T, Q>) {
    this.sqlConnection = dependencies.sqlConnection;
    this.entity = params.entity;
    this.mapToBaseFields = params.mapToRawFields;
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

  protected transformEntityToRaw (entity: T, map: Map<keyof T, keyof Q>): Q {
    return Object.entries(entity).reduce((acc, [key, value]) => {
      const rawFieldName = map.get(key as keyof T) as keyof Q;

      if (rawFieldName == null) {
        throw new Error(`mapping for ${this.entity} ${key} was not find`)
      }

      acc[rawFieldName] = value;

      return acc;
    }, {} as Record<keyof Q, any>);
  }
}
