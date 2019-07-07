import _ from "lodash";
import * as repositories from "../repositories";
import {ICustomerOrder, IFindCustomerOrderRequest, IOrderPizza} from "./types";

export interface ICustomerOrderFinder {
  customerOrderRepository: repositories.CustomerOrderRepository;
  customerOrderPizzaRepository: repositories.CustomerOrderPizzaRepository;
  pizzaRepository: repositories.PizzaRepository;
}

export class CustomerOrderFinder {
  private customerOrderRepository: repositories.CustomerOrderRepository;
  private customerOrderPizzaRepository: repositories.CustomerOrderPizzaRepository;
  private pizzaRepository: repositories.PizzaRepository;

  constructor(dependencies: ICustomerOrderFinder) {
    this.customerOrderRepository = dependencies.customerOrderRepository;
    this.customerOrderPizzaRepository = dependencies.customerOrderPizzaRepository;
    this.pizzaRepository = dependencies.pizzaRepository;
  }

  public async find(request: IFindCustomerOrderRequest): Promise<ICustomerOrder[]> {
    const customerOrders = await this.customerOrderRepository.findMany(
      _.omitBy(
        {
          status: request.status,
          customerId: request.customerId,
        },
        _.isNil,
      ),
    );

    return await Promise.all(
      customerOrders.map(async (customerOrder) => ({
        ...customerOrder,
        pizzas: await this.getPizzasForOrder(customerOrder),
      })),
    );
  }

  public async getPizzasForOrder(customerOrder: repositories.ICustomerOrder): Promise<IOrderPizza[]> {
    const pizzaOrders = await this.customerOrderPizzaRepository.findMany({
      customerOrderId: customerOrder.id,
    });
    const pizzaCosts = await this.getPizzaCosts(pizzaOrders);


    return pizzaOrders.map(pizzaOrder => ({
      id: pizzaOrder.pizzaId,
      count: pizzaOrder.count,
      // todo we definitely know that there is a pizza id due to db restrictions, but may be a good idea to check it
      cost: pizzaCosts.get(pizzaOrder.pizzaId)! * pizzaOrder.count,
    }))
  }

  private async getPizzaCosts (pizzaOrders: repositories.ICustomerOrderPizza[]): Promise<Map<string, number>> {
    const pizzas = await Promise.all(
      pizzaOrders.map(
        async (pizzaOrder) =>
          // todo change find many type tp accept array of values for each key
          await this.pizzaRepository.find({
            id: pizzaOrder.pizzaId,
          }),
      ),
    );

    return pizzas.reduce((acc, pizza) => {
      acc.set(pizza.id, pizza.cost)
      return acc;
    }, new Map<string, number>())
  }

}
