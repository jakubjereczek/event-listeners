type IEvent<T = any, K = any> = {
  [name in keyof T]: {
    [arg in keyof K]: any;
  };
};

type IEventParams<T extends IEvent[number]> = T;

type IEventDictionary<T = any> = {
  [event in keyof T]: {
    listeners: ((...args: any) => void)[];
    args: {
      [arg in keyof event]: any;
    };
  };
};

class ObserverService<E extends IEvent> {
  listeners: IEventDictionary<IEvent>;

  constructor(events: E) {
    const listeners = Object.create(events);
    Object.keys(events).forEach(function (key) {
      listeners[key] = {
        listeners: [],
        args: listeners[key],
      };
    });
    this.listeners = listeners;
  }

  subscribe<N extends keyof E>(
    eventName: N,
    listener: (args: IEventParams<E[N]>) => void,
  ) {
    this.listeners[eventName].listeners.push(listener);
  }

  emit<N extends keyof E>(eventName: N, args: IEventParams<E[N]>) {
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
