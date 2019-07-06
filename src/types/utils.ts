export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export interface IDisposable {
  dispose: () => void;
}

export type UUID = string;
export type ISO_DATE = string;
