import { ZodError } from "zod";
import { ZodAnyDictionary } from "@/types/Zod";
import { Dictionary } from "@/types/Object";

type ValidationResult = { result: boolean; error?: ZodError };

function validateEventParamsWithZodPatterns<T extends ZodAnyDictionary>(
  patterns: T,
  params: Dictionary<any>
): { [key: string]: ValidationResult } {
  const results: { [key: string]: ValidationResult } = {};

  for (const [arg, pattern] of Object.entries(patterns)) {
    const safeParse = pattern.safeParse(params[arg]);

    results[arg] = {
      result: safeParse.success,
      error: !safeParse.success ? safeParse.error : undefined,
    };
  }

  return results;
}

function validateZodPatterns<T extends ZodAnyDictionary>(
  patterns: T,
  params: Dictionary<any>
) {
  const zodValidation = validateEventParamsWithZodPatterns(patterns, params);
  const validationResult = Object.entries(zodValidation);

  return {
    result: validationResult.every(([, value]) => value.result),
    invalid: validationResult
      .filter(([, value]) => value.error)
      .map(([arg, value]) => ({ arg, error: value.error })),
  };
}

export { validateZodPatterns };
