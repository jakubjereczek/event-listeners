import { ZodError, ZodType, ZodTypeAny } from "zod";

type ZodAnyDictionary = {
  [x: string]: ZodTypeAny;
};

type InferZod<T extends { [x: string]: ZodTypeAny }> = {
  [P in keyof T]: T[P] extends ZodType<any, any, any>
    ? ReturnType<(arg: T[P]) => T[P]["_output"]>
    : unknown;
};

type ZodValidationBase = {
  arg: string;
  argName: string;
};

type ZodValidationSucceeded = ZodValidationBase & {
  success: true;
  error: undefined;
};

type ZodValidationFailed = ZodValidationBase & {
  success: false;
  error: ZodError;
};

type ZodValidation = ZodValidationSucceeded | ZodValidationFailed;

export type { ZodAnyDictionary, InferZod, ZodValidation, ZodValidationFailed };
