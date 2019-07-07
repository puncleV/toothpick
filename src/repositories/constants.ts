import {
  ICustomer,
  ICustomerOrder,
  ICustomerOrderPizza,
  IPizza,
  IRawCustomer,
  IRawCustomerOrder,
  IRawCustomerOrderPizza,
  IRawPizza,
} from "./types";

export const PizzaFieldsMap = new Map<keyof IPizza, keyof IRawPizza>([
  ["id", "id"],
  ["name", "name"],
  ["description", "description"],
  ["cost", "cost"],
]);
export const CustomerOrderFieldsMap = new Map<keyof ICustomerOrder, keyof IRawCustomerOrder>([
  ["id", "id"],
  ["status", "status"],
  ["created", "created"],
  ["delivered", "delivered"],
  ["customerId", "customer_id"],
]);
export const CustomerOrderPizzaFieldsMap = new Map<keyof ICustomerOrderPizza, keyof IRawCustomerOrderPizza>([
  ["id", "id"],
  ["customerOrderId", "customer_order_id"],
  ["pizzaId", "pizza_id"],
  ["count", "count"],
]);

export const CustomerFieldsMap = new Map<keyof ICustomer, keyof IRawCustomer>([
  ["id", "id"],
  ["name", "name"],
  ["email", "email"],
]);
