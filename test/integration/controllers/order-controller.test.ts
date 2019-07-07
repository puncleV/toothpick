import casual from "casual";
import {expect, request} from "chai";
import _ from "lodash";

import {server} from "../../../src/api";
import {CustomerOrderStatus} from "../../../src/repositories";
import {createCustomerOrderRepository, createCustomerRepository} from "../component-creators";

describe("OrderContorller", () => {
  it("get by email", async () => {
    const customerRepository = createCustomerRepository();
    const customerOrderRepository = createCustomerOrderRepository();

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
      status: casual.random_value(CustomerOrderStatus),
      created: new Date().toUTCString(),
    });


    const order1 = await customerOrderRepository.create({
      customerId: customer.id,
      status: casual.random_value(CustomerOrderStatus),
      created: new Date().toUTCString(),
    });

    const order2 = await customerOrderRepository.create({
      customerId: customer.id,
      status: casual.random_value(CustomerOrderStatus),
      created: new Date().toUTCString(),
    });

    const response = await request(server).get(`/orders?customerEmail=${customer.email}`);

    expect(response).to.have.status(200);
    expect(response.body, "should return all orders for customer with passed email").to.eql(
      [order1, order2].map((order) =>
        _.omit(
          {
            ...order,
            customer,
            created: new Date(order.created).toISOString()
          },
          "customerId",
        ),
      ),
    );
  });

  it("get by status", async () => {
    const customerRepository = createCustomerRepository();
    const customerOrderRepository = createCustomerOrderRepository();
    const status = casual.random_value(CustomerOrderStatus);
    const customer = await customerRepository.create({
      name: casual.first_name,
      email: casual.email,
    });

    await customerOrderRepository.create({
      customerId: customer.id,
      status: casual.random_value(_.difference(Object.values(CustomerOrderStatus), [status])),
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
    expect(response.body, "should return all orders for customer with passed email").to.eql(
      [order1, order2].map((order) =>
        _.omit(
          {
            ...order,
            customer,
            created: new Date(order.created).toISOString()
          },
          "customerId",
        ),
      ),
    );
  });

  it("get all orders", async () => {
    const customerRepository = createCustomerRepository();
    const customerOrderRepository = createCustomerOrderRepository();

    const customer1 = await customerRepository.create({
      name: casual.first_name,
      email: casual.email,
    });

    const customer2 = await customerRepository.create({
      name: casual.first_name,
      email: casual.email,
    });

    const order1 = await customerOrderRepository.create({
      customerId: customer1.id,
      status: casual.random_value(CustomerOrderStatus),
      created: new Date().toUTCString(),
    });

    const order2 = await customerOrderRepository.create({
      customerId: customer2.id,
      status: casual.random_value(CustomerOrderStatus),
      created: new Date().toUTCString(),
    });

    const response = await request(server).get(`/orders`);

    expect(response).to.have.status(200);
    expect(response.body, "should return all orders").to.eql(
      [order1, order2].map((order) =>
        _.omit(
          {
            ...order,
            customer: order.customerId === customer1.id ? customer1 : customer2,
            created: new Date(order.created).toISOString()
          },
          "customerId",
        ),
      ),
    );
  });

  // todo add get by both filtes
});
