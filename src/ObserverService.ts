import {
  EventDictionary,
  EventListenersDictionary,
  EventParams,
} from 'types/Event';
import { InferZod } from 'types/Zod';
import ZodValidator from 'utils/zod';
import ZodValidationError from 'errors/ZodValidationError';
import Logger from 'utils/Logger';
import { LoggerLevel } from 'types/Logger';

interface ObserverServiceOptions {
  /**
   * In strict mode, when enabled, if the arguments of the emitted event do not conform to the defined pattern,
   * a ZodValidationError will be thrown, and the event will not be emitted. By default, this option is set to true.
   */
  strictCheck?: boolean;
  /**
   * Depends on loggerLevel messages of the selected level will be displayed. By default it has LoggerLevel.Error value and all logs are displayed (Info, Warn and Error).
   */
  loggerLevel?: LoggerLevel;
}

const defaultOptions = {
  strictCheck: true,
  loggerLevel: LoggerLevel.ERROR,
};

class ObserverService<E extends EventDictionary> {
  options: ObserverServiceOptions;
  listeners: EventListenersDictionary<EventDictionary>;

  constructor(events: E, options: ObserverServiceOptions) {
    this.listeners = this.mapEventDictionary(events);
    this.options = options;
    this.setup();
  }

  private setup() {
    Logger.init(this.options.loggerLevel || defaultOptions.loggerLevel);
  }

  private mapEventDictionary(events: E) {
    const listeners = Object.create(events);
    for (const key in listeners) {
      listeners[key] = {
        listeners: [],
        args: listeners[key],
      };
    }
    return listeners;
  }

  private validateEventArgs<N extends keyof E>(
    eventName: N,
    args: InferZod<EventParams<E[N]>>,
  ) {
    const listener = this.listeners[eventName];
    const patterns = listener.args;
    if (listener) {
      const result = new ZodValidator().validate(patterns, args);

      if (!result.success) {
        if (this.options.strictCheck) {
          throw new ZodValidationError(eventName, result.errors);
        }
        Logger.warning(
          `The provided arguments do not satisfy the defined pattern. Nevertheless, the event has been emitted because strictCheck is set to false.`,
          result.errors,
        );
      }
    }
  }

  subscribe<N extends keyof E>(
    eventName: N,
    listener: (args: InferZod<EventParams<E[N]>>) => void,
  ) {
    this.listeners[eventName].listeners.push(listener);
  }

  emit<N extends keyof E>(eventName: N, args: InferZod<EventParams<E[N]>>) {
    if (this.listeners[eventName]) {
      this.validateEventArgs(eventName, args);
      this.listeners[eventName].listeners.forEach(
        (listener: (...args: any) => void) => listener(args),
      );
    }
  }

  unsubscribe<N extends keyof E>(
    eventName: N,
    listener: (args: EventParams<E[N]>) => void,
  ) {
    if (this.listeners[eventName]) {
      const index = this.listeners[eventName].listeners.indexOf(listener);
      if (index > -1) {
        this.listeners[eventName].listeners.splice(index, 1);
      }
    }
  }
}

export default ObserverService;
