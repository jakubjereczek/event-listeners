import { ZodType, ZodTypeAny } from 'zod';

type InferZod<T extends { [x: string]: ZodTypeAny }> = {
  [P in keyof T]: T[P] extends ZodType<any, any, any>
    ? ReturnType<(arg: T[P]) => T[P]['_output']>
    : unknown;
};

export type { InferZod };
