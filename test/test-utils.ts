import {createSqlConnection} from "./integration/component-creators";

export const cleanUpDatabase = async () => {
  const sqlConnection = createSqlConnection();
  await sqlConnection.connection("customer_order_pizza").delete();
  await sqlConnection.connection("customer_order").delete();
  await sqlConnection.connection("pizza").delete();
  await sqlConnection.connection("customer").delete();
};
