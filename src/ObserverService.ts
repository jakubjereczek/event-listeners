import {
  EventDictionary,
  EventListenersDictionary,
  EventParams,
} from "@/types/Event";
import { InferZod } from "@/types/Zod";
import { validateZodPatterns } from "@/zod";

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

  subscribe<N extends keyof E>(
    eventName: N,
    listener: (args: InferZod<EventParams<E[N]>>) => void
  ) {
    this.listeners[eventName].listeners.push(listener);
  }

  emit<N extends keyof E>(eventName: N, args: InferZod<EventParams<E[N]>>) {
    if (this.listeners[eventName]) {
      const { args: patterns, listeners } = this.listeners[eventName];
      const validated = validateZodPatterns(patterns, args);
      if (!validated.result) {
        console.error(
          `An error occured with Zod validation when tried to emit '${eventName}' event.`,
          validated.invalid.error
        );
      }

      listeners.forEach((listener: (...args: any) => void) => listener(args));
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
