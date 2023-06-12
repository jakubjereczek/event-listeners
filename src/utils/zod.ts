import { ZodIssue } from "zod";
import { ZodAnyDictionary, ZodValidation } from "@/types/Zod";
import { Dictionary } from "@/types/Object";

class ZodValidator {
  constructor() {}

  formatErrorMessages({ path, message }: ZodIssue): string {
    return `${path.join(".")} ${message}`;
  }

  hasValidationErrors(results: ZodValidation[]): boolean {
    return this.filterValidationErrors(results).length > 0;
  }

  filterValidationErrors(results: ZodValidation[]): ZodValidation[] {
    return results.filter((result) => !result.success);
  }

  validateArgs<T extends ZodAnyDictionary>(
    patterns: T,
    params: Dictionary<any>
  ): ZodValidation[] {
    const validationResults: ZodValidation[] = [];

    for (const [arg, pattern] of Object.entries(patterns)) {
      const safeParse = pattern.safeParse(params[arg]);

      validationResults.push({
        arg: params[arg],
        argName: arg,
        success: safeParse.success,
        error: safeParse.success ? undefined : safeParse.error,
      });
    }

    return validationResults;
  }

  validate<T extends ZodAnyDictionary>(
    patterns: T,
    params: Dictionary<any>
  ): { success: boolean; messages?: string[] } {
    const validationResults = this.validateArgs(patterns, params);

    if (!this.hasValidationErrors(validationResults)) {
      return { success: true };
    }

    const errorMessages = this.filterValidationErrors(validationResults).map(
      (result) =>
        `${result.argName} (${result.arg}): ${this.formatErrorMessages(
          result.error!.errors[0]
        )}`
    );

    return { success: false, messages: errorMessages };
  }
}

export default ZodValidator;
