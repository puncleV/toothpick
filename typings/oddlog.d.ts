declare module "oddlog" {
  interface ILoggerTransport {
    type: string;
    format?: string;
  }

  interface ILoggerOptions {
    transports: ILoggerTransport[];
  }

  interface ILogger {
    // TODO: add proper typings
    child: any;
    debug: any;
    info: any;
    warn: any;
    error: any;
    fatal: any;
  }

  export function createLogger(name: string, options?: ILoggerOptions): ILogger;
}
