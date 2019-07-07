import uuid from "uuid";

import {sql} from "../adapters";
import * as types from "../types";

export interface IBaseRepositoryDependencies {
  sqlConnection: sql.SqlConnection;
}

// T - internal type, Q - type as it is in database
export interface IBaseRepositoryParams<T, Q> {
  entity: string;
  mapToRawFields: Map<keyof T, keyof Q>;
}

export class BaseRepository<T extends {id: string}, Q> {
  protected sqlConnection: sql.SqlConnection;
  protected entity: string;
  protected mapToRawFields: Map<keyof T, keyof Q>;
  protected mapToInternalFields: Map<keyof Q, keyof T>;

  constructor(dependencies: IBaseRepositoryDependencies, params: IBaseRepositoryParams<T, Q>) {
    this.sqlConnection = dependencies.sqlConnection;
    this.entity = params.entity;
    this.mapToRawFields = params.mapToRawFields;
    this.mapToInternalFields = Array.from(params.mapToRawFields.entries()).reduce(
      (acc, [key, value]) => {
        acc.set(value, key as keyof T);
        return acc;
      },
      new Map() as Map<keyof Q, keyof T>,
    );
  }

  public async create(entity: types.Omit<T, "id">): Promise<T> {
    const id = uuid.v4();

    await this.sqlConnection.connection(this.entity).insert(this.getRawEntityFromInternal({...entity, id} as T));

    return await this.findById(id) as T;
  }

  public async find(entity: Partial<T>): Promise<T | null> {
    return this.getInternalEntityFromRaw(
      await this.sqlConnection
        .connection(this.entity)
        .where(this.getRawEntityFromInternal(entity))
        .first(),
    ) as T;
  }

  public async findMany(entity: Partial<T>): Promise<T[]> {
    return (await this.sqlConnection.connection(this.entity).where(this.getRawEntityFromInternal(entity))).map(
      (rawEntity) => this.getInternalEntityFromRaw(rawEntity) as T,
    );
  }

  public async update(id: string, entity: Partial<types.Omit<T, "id">>) {
    await this.sqlConnection
      .connection(this.entity)
      .where({id})
      .update(this.getRawEntityFromInternal(entity as T));

    return this.findById(id);
  }

  public async findById(id: string): Promise<T | null> {
    return this.getInternalEntityFromRaw(
      await this.sqlConnection
        .connection(this.entity)
        .where({id})
        .first(),
    ) as T;
  }

  public async deleteById (id: string): Promise<void> {
    return await this.sqlConnection
      .connection(this.entity)
      .where({id})
      .del()
  }

  public async delete(entity: Partial<T>): Promise<void> {
    return await this.sqlConnection
        .connection(this.entity)
        .where(this.getRawEntityFromInternal(entity))
        .del()
  }

  // todo this is not the best place for this generic method
  protected changeKeysByMap<X, Y>(entity: Partial<X>, map: Map<keyof X, keyof Y>): Partial<Y> {
    return Object.entries(entity).reduce(
      (acc, [key, value]) => {
        const rawFieldName = map.get(key as keyof X) as keyof Y;

        if (rawFieldName == null) {
          throw new Error(`mapping for ${this.entity} ${key} was not find`);
        }

        acc[rawFieldName] = value;

        return acc;
      },
      {} as Record<keyof Y, any>,
    );
  }

  protected getInternalEntityFromRaw(entity: Partial<Q> | Q): Partial<T> | T | null {
    if (entity == null) {
      return null
    }

    return this.changeKeysByMap(entity, this.mapToInternalFields);
  }

  protected getRawEntityFromInternal(entity: Partial<T> | T): Partial<Q> | Q {
    return this.changeKeysByMap(entity, this.mapToRawFields);
  }
}
