import { Configurations } from './configuration';

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}
const globalLevel = Configurations.getInstance().globalLogLevel;

export class Logger {
  private logLevel:string;

  constructor(loggingLevel:string) {
    this.logLevel = loggingLevel;
  }

  public trace(body: unknown, params?: unknown): boolean {
    if (LogLevel[this.logLevel] > LogLevel.TRACE) {
      return false;
    }
    Logger.handleLogFunction(body, console.trace, params);
    return true;
  }

  public debug(body: unknown, params?: unknown): boolean {
    if (LogLevel[this.logLevel] > LogLevel.DEBUG) {
      return false;
    }
    Logger.handleLogFunction(body, console.debug, params);
    return true;
  }

  public info(body: unknown, params?: unknown): boolean {
    if (LogLevel[this.logLevel] > LogLevel.INFO) {
      return false;
    }
    Logger.handleLogFunction(body, console.info, params);
    return true;
  }

  public warn(body: unknown, params?: unknown): boolean {
    if (LogLevel[this.logLevel] > LogLevel.WARN) {
      return false;
    }
    Logger.handleLogFunction(body, console.warn, params);
    return true;
  }

  public error(body: unknown, params?: unknown): boolean {
    if (LogLevel[this.logLevel] > LogLevel.ERROR) {
      return false;
    }
    Logger.handleLogFunction(body, console.error, params);
    return true;
  }

  static handleLogFunction(
    body: unknown,
    method: (b: unknown, p?: unknown) => unknown,
    params?: unknown,
  ): void {
    if (params) {
      method(body, params);
    }
    method(body);
  }
}

export const log = new Logger(globalLevel);
