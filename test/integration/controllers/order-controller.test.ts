import casual from "casual";
import {expect, request} from "chai";
import _ from "lodash";

import {server} from "../../../src/api";
import {CustomerOrderStatus} from "../../../src/repositories";
import {createCustomerOrderRepository, createCustomerRepository} from "../component-creators";

describe("server", () => {
  it("Responds to a request", async () => {
    const customerRepository = createCustomerRepository();
    const customerOrderRepository = createCustomerOrderRepository();

    const customer = await customerRepository.create({
      name: casual.first_name,
      email: casual.email,
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
    expect(response.body).to.eql(
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
});
