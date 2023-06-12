import { ZodError, ZodType, ZodTypeAny } from 'zod';

type ZodAnyDictionary = {
  [x: string]: ZodTypeAny;
};

type InferZod<T extends { [x: string]: ZodTypeAny }> = {
  [P in keyof T]: T[P] extends ZodType<any, any, any>
    ? ReturnType<(arg: T[P]) => T[P]['_output']>
    : unknown;
};

type ZodValidationBase = {
  arg: string;
  argName: string;
};

enum ZodValidationStatus {
  Succeed,
  Failed,
}

type ZodValidationSucceeded = ZodValidationBase & {
  status: ZodValidationStatus.Succeed;
  error: undefined;
};

type ZodValidationFailed = ZodValidationBase & {
  status: ZodValidationStatus.Failed;
  error: ZodError<unknown>;
};

type ZodValidation = ZodValidationSucceeded | ZodValidationFailed;

type ZodValidationResult = ZodValidationBase & {
  message: string;
};

export type {
  ZodAnyDictionary,
  InferZod,
  ZodValidation,
  ZodValidationResult,
  ZodValidationFailed,
};

export { ZodValidationStatus };
