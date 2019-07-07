import casual from "casual";
import {expect, request} from "chai";
import _ from "lodash";

import {server} from "../../../src/api";
import * as repositories from "../../../src/repositories";
import {
  createCustomerOrderPizzaRepository,
  createCustomerOrderRepository,
  createCustomerRepository,
} from "../component-creators";
import {createPizza} from "../entity-creators";
import {DEFAULT_RESPONSE_STATUS} from "../../../src/controllers/constants";

describe("OrderContorller", () => {
  let customerRepository: repositories.CustomerRepository;
  let customerOrderRepository: repositories.CustomerOrderRepository;
  let customerOrderPizzaRepository: repositories.CustomerOrderPizzaRepository;

  before(() => {
    customerRepository = createCustomerRepository();
    customerOrderRepository = createCustomerOrderRepository();
    customerOrderPizzaRepository = createCustomerOrderPizzaRepository();
  });

  describe("get", () => {
    it("get by customerId", async () => {
      const customer = await customerRepository.create({
        name: casual.first_name,
        email: casual.email,
      });

      const customer2 = await customerRepository.create({
        name: casual.first_name,
        email: casual.email,
      });

      await customerOrderRepository.create({
        customerId: customer2.id,
        status: casual.random_value(repositories.CustomerOrderStatus),
        created: new Date().toUTCString(),
      });

      const order1 = await customerOrderRepository.create({
        customerId: customer.id,
        status: casual.random_value(repositories.CustomerOrderStatus),
        created: new Date().toUTCString(),
      });

      const order2 = await customerOrderRepository.create({
        customerId: customer.id,
        status: casual.random_value(repositories.CustomerOrderStatus),
        created: new Date().toUTCString(),
      });

      const response = await request(server).get(`/orders?customerId=${customer.id}`);

      expect(response).to.have.status(200);
      expect(
        (response.body as any[]).map((order) => order.id),
        "should return all orders for customer with passed email",
      ).to.eql([order1, order2].map((order) => order.id));
    });

    it("get by status", async () => {
      const status = casual.random_value(repositories.CustomerOrderStatus);
      const customer = await customerRepository.create({
        name: casual.first_name,
        email: casual.email,
      });

      await customerOrderRepository.create({
        customerId: customer.id,
        status: casual.random_value(_.difference(Object.values(repositories.CustomerOrderStatus), [status])),
        created: new Date().toUTCString(),
      });

      const order1 = await customerOrderRepository.create({
        customerId: customer.id,
        status,
        created: new Date().toUTCString(),
      });

      const order2 = await customerOrderRepository.create({
        customerId: customer.id,
        status,
        created: new Date().toUTCString(),
      });

      const response = await request(server).get(`/orders?status=${status}`);

      expect(response).to.have.status(200);
      expect(
        (response.body as any[]).map((order) => order.id),
        "should return all orders for customer with passed email",
      ).to.eql([order1, order2].map((order) => order.id));
    });

    it("get all orders", async () => {
      const pizza = await createPizza();
      const pizza2 = await createPizza();
      const customer1 = await customerRepository.create({
        name: casual.first_name,
        email: casual.email,
      });

      const order1 = await customerOrderRepository.create({
        customerId: customer1.id,
        status: casual.random_value(repositories.CustomerOrderStatus),
        created: new Date().toUTCString(),
      });

      const customerOrderPizza1 = await customerOrderPizzaRepository.create({
        customerOrderId: order1.id,
        pizzaId: pizza.id,
        count: casual.integer(1, 100),
      });

      const customerOrderPizza2 = await customerOrderPizzaRepository.create({
        customerOrderId: order1.id,
        pizzaId: pizza2.id,
        count: casual.integer(1, 100),
      });

      const response = await request(server).get(`/orders`);

      expect(response).to.have.status(200);
      expect(response.body, "should count all pizzas costs").to.eql([
        {
          ...order1,
          created: new Date(order1.created).toISOString(),
          pizzas: [
            {
              count: customerOrderPizza1.count,
              id: customerOrderPizza1.pizzaId,
              cost: customerOrderPizza1.count * pizza.cost,
            },
            {
              count: customerOrderPizza2.count,
              id: customerOrderPizza2.pizzaId,
              cost: customerOrderPizza2.count * pizza2.cost,
            },
          ],
        },
      ]);
    });

    // todo add get by both filters
  });

  describe("delete", () => {
    it("delete order", async () => {
      const pizza = await createPizza();
      const pizza2 = await createPizza();
      const customer = await customerRepository.create({
        name: casual.first_name,
        email: casual.email,
      });

      const order = await customerOrderRepository.create({
        customerId: customer.id,
        status: repositories.CustomerOrderStatus.PENDING,
        created: new Date().toUTCString(),
      });

      await customerOrderPizzaRepository.create({
        customerOrderId: order.id,
        pizzaId: pizza.id,
        count: casual.integer(1, 100),
      });

      await customerOrderPizzaRepository.create({
        customerOrderId: order.id,
        pizzaId: pizza2.id,
        count: casual.integer(1, 100),
      });

      const response = await request(server).del(`/orders/${order.id}`);

      expect(response).to.have.status(200);
      expect(response.body).to.be.eql({
        status: DEFAULT_RESPONSE_STATUS.SUCCESS,
      });
      const customerOrder = await customerOrderPizzaRepository.findMany({
        customerOrderId: order.id,
      });

      expect(customerOrder).to.be.an.instanceof(Array).that.is.empty;
    });

    it("try to delete order not in pending status", async () => {
      const pizza = await createPizza();
      const pizza2 = await createPizza();
      const customer = await customerRepository.create({
        name: casual.first_name,
        email: casual.email,
      });

      const order = await customerOrderRepository.create({
        customerId: customer.id,
        status: casual.random_value([
          repositories.CustomerOrderStatus.DELIVERED,
          repositories.CustomerOrderStatus.PREPARING,
          repositories.CustomerOrderStatus.TRANSIT,
          repositories.CustomerOrderStatus.DELIVERED,
        ]),
        created: new Date().toUTCString(),
      });

      await customerOrderPizzaRepository.create({
        customerOrderId: order.id,
        pizzaId: pizza.id,
        count: casual.integer(1, 100),
      });

      await customerOrderPizzaRepository.create({
        customerOrderId: order.id,
        pizzaId: pizza2.id,
        count: casual.integer(1, 100),
      });

      const response = await request(server).del(`/orders/${order.id}`);

      expect(response).to.have.status(500);
      expect(response.body).to.have.property("message", `Cant cancel order in ${order.status} status`);
    });
  });
});
