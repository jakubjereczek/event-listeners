import { ZodTypeAny } from 'zod';

type EventDictionary<T = any, K = any> = {
  [N in keyof T]: {
    [A in keyof K]: ZodTypeAny;
  };
};

type EventParams<T extends EventDictionary[number]> = T;

type EventListenersDictionary<T = any> = {
  [E in keyof T]: {
    listeners: ((...args: any) => void)[];
    args: {
      [A in keyof E]: ZodTypeAny;
    };
  };
};

export { EventDictionary, EventParams, EventListenersDictionary };
