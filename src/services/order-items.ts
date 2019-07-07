import * as repositories from "../repositories";

export interface IOrderItemsDependencies {
  customerOrderPizzaRepository: repositories.CustomerOrderPizzaRepository;
  pizzaRepository: repositories.PizzaRepository;
}

export class OrderItems {
  private customerOrderPizzaRepository: repositories.CustomerOrderPizzaRepository;
  private pizzaRepository: repositories.PizzaRepository;

  constructor(dependencies: IOrderItemsDependencies) {
    this.customerOrderPizzaRepository = dependencies.customerOrderPizzaRepository;
    this.pizzaRepository = dependencies.pizzaRepository;
  }

  public async addPizzaToOrder(orderId: string, pizzaId: string) {
    const [pizza, order] = await Promise.all([
      this.pizzaRepository.findById(pizzaId),
      this.customerOrderPizzaRepository.findById(orderId),
    ]);

    if (pizza == null) {
      throw new Error("cant find pizza to add");
    }

    if (order == null) {
      throw new Error("cant find order to add");
    }

    await this.customerOrderPizzaRepository.update(order.id, {
      count: order.count + 1,
    });
  }

  public async clearByOrderId(orderId: string) {
    await this.customerOrderPizzaRepository.delete({
      customerOrderId: orderId,
    });
  }
}
