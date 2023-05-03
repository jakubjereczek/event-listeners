import { IEvent, IEventDictionary, IEventParams } from 'types/Event';
import { InferZod } from 'types/Zod';

class ObserverService<E extends IEvent> {
  listeners: IEventDictionary<IEvent>;

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
    listener: (args: InferZod<IEventParams<E[N]>>) => void,
  ) {
    this.listeners[eventName].listeners.push(listener);
  }

  emit<N extends keyof E>(eventName: N, args: InferZod<IEventParams<E[N]>>) {
    if (this.listeners[eventName]) {
      this.listeners[eventName].listeners.forEach(
        (listener: (...args: any) => void) => listener(args),
      );
    }
  }

  unsubscribe<N extends keyof E>(
    eventName: N,
    listener: (args: IEventParams<E[N]>) => void,
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
