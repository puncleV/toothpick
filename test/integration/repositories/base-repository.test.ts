import casual from "casual";
import {expect} from "chai";
import _ from "lodash";

import {sql} from "../../../src/adapters";
import * as repositories from "../../../src/repositories";
import {createSqlConnection} from "../component-creators";

describe("BaseRepository", () => {
  interface ITestType {
    id: string,
    field1: string,
    field2: string,
  }

  const createTestTypeData = (overrides: Partial<ITestType> = {}) =>({
    field1: casual.uuid,
    field2: casual.uuid,
    id: casual.uuid,
    ...overrides
  });

  describe("integration", () => {
    let sqlConnection: sql.SqlConnection;
    let baseRepository: repositories.BaseRepository<ITestType, ITestType>;
    let tableName: string ;

    beforeEach(async () => {
      sqlConnection = createSqlConnection();
      tableName = `test_${casual.uuid}`;

      await sqlConnection.connection.schema.createTable(tableName, (table) => {
        table.uuid("id");
        table.string("field1", 50);
        table.string("field2", 50);
      });

      baseRepository = new repositories.BaseRepository<ITestType, ITestType>({
        sqlConnection
      }, {
        entity: tableName,
        mapToRawFields: new Map<keyof ITestType, keyof ITestType>([
          ["id", "id"],
          ["field1", "field1"],
          ["field2", "field2"],
        ])
      });
    });

    afterEach(async () => {
      await sqlConnection.connection.schema.dropTableIfExists(tableName);
    })

    describe ("create", () => {
      it("create row", async () => {
        const entity: ITestType = createTestTypeData();

        const entityRow = await baseRepository.create(entity);

        expect(entityRow, "should save correct fields").to.contain(_.omit(entity, "id"));
        expect(entityRow.id, "should generate id on its own").is.not.null.and.not.eql(entity.id);
      })
    })

    describe("findMany", () => {
      it("find row when only one exists", async () => {
        const entity: ITestType = createTestTypeData();
        const findKey = casual.random_value(Object.keys(entity));

        await sqlConnection.connection(tableName).insert(entity);

        const [entityRow] = await baseRepository.findMany({
          [findKey]: _.get(entity, findKey),
        });

        expect(entityRow, "should save correct fields").to.eql(entity);
      })

      it("find row when only N exists", async () => {
        const firstEntity: ITestType = createTestTypeData();
        const secondEntity: ITestType = createTestTypeData({
          field1: firstEntity.field1
        });

        await sqlConnection.connection(tableName).insert(firstEntity);
        await sqlConnection.connection(tableName).insert(secondEntity);

        for (let i = 0; i < 10; i++) {
          await sqlConnection.connection(tableName).insert(createTestTypeData());
        }

        const entities = await baseRepository.findMany({
          field1: firstEntity.field1
        });

        expect(entities, "should find all entities").to.eql([firstEntity, secondEntity]);
      })
    })

    describe("find", () => {
      it("find a row", async () => {
        const entity: ITestType = createTestTypeData();
        const findKey = casual.random_value(Object.keys(entity));

        for (let i = 0; i < 10; i++) {
          await sqlConnection.connection(tableName).insert(createTestTypeData());
        }

        await sqlConnection.connection(tableName).insert(entity);

        const entityRow = await baseRepository.find({
          [findKey]: _.get(entity, findKey),
        });

        expect(entityRow, "should save correct fields").to.eql(entity);
      })
    })

    describe("findById", () => {
      it("find row when only one exists", async () => {
        const entity: ITestType = createTestTypeData();

        for (let i = 0; i < 10; i++) {
          await sqlConnection.connection(tableName).insert(createTestTypeData());
        }

        await sqlConnection.connection(tableName).insert(entity);

        const entityRow = await baseRepository.findById(entity.id);

        expect(entityRow, "should find one by id").to.eql(entity);
      })
    })

    describe("update", () => {
      it("update row", async () => {
        const entity: ITestType = createTestTypeData();
        const updateKey = casual.random_value(Object.keys(_.omit(entity, "id")));
        const updateValue = casual.uuid;

        await sqlConnection.connection(tableName).insert(entity);

        await baseRepository.update(entity.id, {
          [updateKey]: updateValue,
        });

        const entityRow = await sqlConnection.connection(tableName).where({id: entity.id}).first();

        expect(entityRow, "should update row").to.eql({
          ...entity,
          [updateKey]: updateValue,
        });
      })
    })

    describe("delete", () => {
      it("delete row", async () => {
        const entity: ITestType = createTestTypeData();

        await sqlConnection.connection(tableName).insert(entity);

        await baseRepository.delete(entity);

        const entityRow = await sqlConnection.connection(tableName).where({id: entity.id}).first();

        expect(entityRow, "should update row").to.eql(undefined);
      })
    })

    describe("deleteById", () => {
      it("delete row", async () => {
        const entity: ITestType = createTestTypeData();

        await sqlConnection.connection(tableName).insert(entity);

        await baseRepository.deleteById(entity.id);

        const entityRow = await sqlConnection.connection(tableName).where({id: entity.id}).first();

        expect(entityRow, "should update row").to.eql(undefined);
      })
    })

    it("fields mapping", async () => {
      baseRepository = new repositories.BaseRepository<ITestType, ITestType>({
        sqlConnection
      }, {
        entity: tableName,
        mapToRawFields: new Map<keyof ITestType, keyof ITestType>([
          ["id", "id"],
          ["field1", "field1"],
        ])
      });
      const entity: ITestType = createTestTypeData();

      try {
        await baseRepository.create(entity);
      } catch (e) {
        // todo add special Error type and check only instanceof instead of hardcoded string
        expect(e).to.be.instanceof(Error).with.property("message", `mapping for ${tableName} field2 was not find`)
      }
    })
  });
});
