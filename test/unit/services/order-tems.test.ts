import casual from "casual";
import {expect} from "chai";
import sinon from "sinon";

import * as repositories from "../../../src/repositories";

import {OrderItems} from "../../../src/services/order-items";

describe("OrderItems", () => {
  let orderItems: OrderItems;
  let customerOrderPizzaRepository: any;
  let pizzaRepository: any;

  beforeEach(() => {
    customerOrderPizzaRepository = sinon.createStubInstance(repositories.CustomerOrderPizzaRepository);
    pizzaRepository = sinon.createStubInstance(repositories.PizzaRepository);

    orderItems = new OrderItems({
      customerOrderPizzaRepository,
      pizzaRepository,
    });
  });

  describe("addPizzaToOrder", () => {
    beforeEach(() => {
      // todo add helper to initiate stub with throws method
      pizzaRepository.findById.throws(new Error("unmocked pizzaRepository.findById"));
      customerOrderPizzaRepository.findById.throws(new Error("unmocked customerOrderPizzaRepository.findById"));
      customerOrderPizzaRepository.update.throws(new Error("unmocked customerOrderPizzaRepository.update"));
    });

    it("add pizza to order", async () => {
      const orderId = casual.uuid;
      const pizzaId = casual.uuid;
      const count = casual.integer(0, 100);

      pizzaRepository.findById.withArgs(pizzaId).resolves({id: pizzaId});
      customerOrderPizzaRepository.findById.withArgs(orderId).resolves({id: orderId, count});
      customerOrderPizzaRepository.update.resolves();

      await orderItems.addPizzaToOrder(orderId, pizzaId);

      expect(customerOrderPizzaRepository.update, "should update count").to.be.calledWith(orderId, {
        count: count + 1,
      });
    });

    it("fails if order doesn't exist", async () => {
      const orderId = casual.uuid;
      const pizzaId = casual.uuid;

      pizzaRepository.findById.withArgs(pizzaId).resolves({id: pizzaId});
      customerOrderPizzaRepository.findById.withArgs(orderId).resolves(null);

      try {
        await orderItems.addPizzaToOrder(orderId, pizzaId);
        expect.fail();
      } catch (e) {
        expect(e).to.be.instanceof(Error).with.property("message", "cant find order to add");
      }
    });

    it("fails if pizza doesn't exist", async () => {
      const orderId = casual.uuid;
      const pizzaId = casual.uuid;
      const count = casual.integer(0, 100);

      pizzaRepository.findById.withArgs(pizzaId).resolves(null);
      customerOrderPizzaRepository.findById.withArgs(orderId).resolves({id: orderId, count});

      try {
        await orderItems.addPizzaToOrder(orderId, pizzaId);
        expect.fail();
      } catch (e) {
        expect(e).to.be.instanceof(Error).with.property("message", "cant find pizza to add");
      }
    });
  });

  describe("clearByOrderId", () => {
    it("calls repository's delete method", async () => {
      const orderId = casual.uuid;
      await orderItems.clearByOrderId(orderId);

      expect(customerOrderPizzaRepository.delete).to.be.calledWith({customerOrderId: orderId});
    });
  });
});
