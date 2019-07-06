import {createSqlConnection} from "./integration/component-creators";

export const cleanUpDatabase = async () => {
  const sqlConnection = createSqlConnection();

  sqlConnection.connection("customer").where({}).delete();
  sqlConnection.connection("customer_order_pizza").where({}).delete();
  sqlConnection.connection("customer_order").where({}).delete();
  sqlConnection.connection("pizza").where({}).delete();
  sqlConnection.connection("pizza_base").where({}).delete();
  sqlConnection.connection("pizza_size").where({}).delete();
};
