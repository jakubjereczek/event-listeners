import {
  EventDictionary,
  EventListenersDictionary,
  EventParams,
} from "@/types/Event";
import { InferZod } from "@/types/Zod";
import ZodValidator from "@/utils/zod";
import ZodValidationError from "@/errors/ZodValidationError";

class ObserverService<E extends EventDictionary> {
  listeners: EventListenersDictionary<EventDictionary>;

  constructor(events: E) {
    this.listeners = this.mapEventDictionary(events);
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
    args: InferZod<EventParams<E[N]>>
  ) {
    if (this.listeners[eventName]) {
      const { args: patterns } = this.listeners[eventName];
      const result = new ZodValidator().validate(patterns, args);

      if (result.success) {
        return true;
      }
      throw new ZodValidationError(eventName, result.messages);
    }
  }

  subscribe<N extends keyof E>(
    eventName: N,
    listener: (args: InferZod<EventParams<E[N]>>) => void
  ) {
    this.listeners[eventName].listeners.push(listener);
  }

  emit<N extends keyof E>(eventName: N, args: InferZod<EventParams<E[N]>>) {
    if (this.listeners[eventName]) {
      this.validateEventArgs(eventName, args);
      this.listeners[eventName].listeners.forEach(
        (listener: (...args: any) => void) => listener(args)
      );
    }
  }

  unsubscribe<N extends keyof E>(
    eventName: N,
    listener: (args: EventParams<E[N]>) => void
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
