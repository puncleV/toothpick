export type ExcludeId <T, K> = Pick<T, Exclude<keyof T, K>>

export interface ICustomer {
  id: string;
  name: string;
  email: string;
}
