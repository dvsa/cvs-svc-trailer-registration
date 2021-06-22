import { Configurations } from './configuration';

export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}
const globalLevel = Configurations.getInstance().GlobalLogLevel;

export const trace = (body: unknown, params?: unknown): void => {
  if (LogLevel[globalLevel] > LogLevel.TRACE) {
    return;
  }
  handleLogFunction(body, console.trace, params);
};

export const debug = (body: unknown, params?: unknown): void => {
  if (LogLevel[globalLevel] > LogLevel.DEBUG) {
    return;
  }
  handleLogFunction(body, console.debug, params);
};

export const info = (body: unknown, params?: unknown): void => {
  if (LogLevel[globalLevel] > LogLevel.INFO) {
    return;
  }
  handleLogFunction(body, console.info, params);
};

export const warn = (body: unknown, params?: unknown): void => {
  if (LogLevel[globalLevel] > LogLevel.WARN) {
    return;
  }
  handleLogFunction(body, console.warn, params);
};

export const error = (body: unknown, params?: unknown): void => {
  if (LogLevel[globalLevel] > LogLevel.ERROR) {
    return;
  }
  handleLogFunction(body, console.error, params);
};

export const handleLogFunction = (body: unknown, method: (b: unknown, p?: unknown) => unknown, params?: unknown): void => {
  if (params) {
    method(body, params);
  }
  method(body);
};
