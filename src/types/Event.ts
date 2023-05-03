import { ZodTypeAny } from 'zod';

type IEvent<T = any, K = any> = {
  [Name in keyof T]: {
    [Arg in keyof K]: ZodTypeAny;
  };
};

type IEventParams<T extends IEvent[number]> = T;

type IEventDictionary<T = any> = {
  [Event in keyof T]: {
    listeners: ((...args: any) => void)[];
    args: {
      [Arg in keyof Event]: any;
    };
  };
};

export { IEvent, IEventParams, IEventDictionary };
