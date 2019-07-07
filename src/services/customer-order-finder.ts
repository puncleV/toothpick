import _ from "lodash";
import * as repositories from "../repositories";
import {IFindCustomerOrderRequest} from "./types";

export interface ICustomerOrderFinder {
  customerOrderRepository: repositories.CustomerOrderRepository;
  customerRepository: repositories.CustomerRepository;
}

export class CustomerOrderFinder {
  private customerOrderRepository: repositories.CustomerOrderRepository;
  private customerRepository: repositories.CustomerRepository;

  constructor(dependencies: ICustomerOrderFinder) {
    this.customerOrderRepository = dependencies.customerOrderRepository;
    this.customerRepository = dependencies.customerRepository;
  }

  public async find(request: IFindCustomerOrderRequest): Promise<repositories.ICustomerOrder[]> {
    const customer = request.customerEmail != null ? await this.getCustomer(request.customerEmail!) : null;

    const customerOrders = await this.customerOrderRepository.findMany(_.omitBy({
      status: request.status,
      customerId: customer ? customer.id : null,
    }, _.isNil));

    return customerOrders;
  }

  private async getCustomer(email: string) : Promise<repositories.ICustomer> {
    const customer = await this.customerRepository.findByEmail(email);

    if (customer == null) {
      // todo add typed error class
      throw new Error("Can't find customer with passed email");
    }

    return customer;
  }
}
