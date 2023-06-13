import { LOGGER_PREFIX, LoggerLevel } from 'types/Logger';

class Logger {
  static loggerLevel: LoggerLevel;

  static init(loggerLevel: LoggerLevel) {
    this.loggerLevel = loggerLevel;
  }

  static info(...data: any[]) {
    if (this.loggerLevel >= LoggerLevel.INFO) {
      return console.log(...[LOGGER_PREFIX, ...data]);
    }
  }

  static warning(...data: any[]) {
    if (this.loggerLevel >= LoggerLevel.WARNING) {
      return console.warn(...[LOGGER_PREFIX, ...data]);
    }
  }

  static error(...data: any[]) {
    if (this.loggerLevel === LoggerLevel.ERROR) {
      return console.error(...[LOGGER_PREFIX, ...data]);
    }
  }

  constructor() {}
}

export default Logger;
