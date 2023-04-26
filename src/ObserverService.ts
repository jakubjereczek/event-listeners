type IEvent<T = any> = {
  [key in keyof T]: {
    [arg: string]: any;
  };
};

type IEventParams<T extends IEvent[number]> = T;

type IEventDictionary<T = any> = {
  [event in keyof T]: ((...args: any) => void)[];
};

class ObserverService<E extends IEvent> {
  events: E;
  listeners: IEventDictionary;

  constructor(events: E) {
    this.events = events;

    const listeners = Object.create(events);
    Object.keys(this.events).forEach(function (key) {
      listeners[key] = [];
    });
    this.listeners = listeners;
  }

  subscribe<N extends keyof E>(
    eventName: N,
    listener: (args: IEventParams<E[N]>) => void,
  ) {
    if (!this.listeners[eventName]) {
      this.listeners[eventName] = [];
    }
    this.listeners[eventName].push(listener);
  }

  emit<N extends keyof E>(eventName: N, args: IEventParams<E[N]>) {
    console.log(this.events);
    if (this.listeners[eventName]) {
      this.listeners[eventName].forEach((listener: (...args: any) => void) =>
        listener(args),
      );
    }
  }

  unsubscribe<N extends keyof E>(
    eventName: N,
    listener: (args: IEventParams<E[N]>) => void,
  ) {
    if (this.events[eventName]) {
      const index = this.events[eventName].indexOf(listener);
      if (index > -1) {
        this.events[eventName].splice(index, 1);
      }
    }
  }
}

export default ObserverService;
