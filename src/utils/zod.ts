import { ZodIssue } from 'zod';
import {
  ZodAnyDictionary,
  ZodValidation,
  ZodValidationResult,
  ZodValidationStatus,
} from 'types/Zod';
import { Dictionary } from 'types/Object';

class ZodValidator {
  constructor() {}

  private formatIssue({ path, message }: ZodIssue): string {
    return `${path.join('.')} ${message}`;
  }

  private formatIssues = (issues: ZodIssue[]) => {
    const messages = issues.map((issue) => this.formatIssue(issue));

    return messages.join(', ');
  };

  private hasErrors(results: ZodValidation[]): boolean {
    return this.getValidationErrors(results).length > 0;
  }

  private getValidationErrors(results: ZodValidation[]): ZodValidation[] {
    return results.filter(
      (result) => result.status === ZodValidationStatus.Failed,
    );
  }

  private getValidationResults<T extends ZodAnyDictionary>(
    patterns: T,
    params: Dictionary<any>,
  ): ZodValidation[] {
    const validationResults: ZodValidation[] = [];

    for (const [arg, pattern] of Object.entries(patterns)) {
      const baseArgs = {
        arg: params[arg],
        argName: arg,
      };
      const safeParse = pattern.safeParse(params[arg]);

      if (safeParse.success) {
        validationResults.push({
          ...baseArgs,
          status: ZodValidationStatus.Succeed,
          error: undefined,
        });
      } else {
        validationResults.push({
          ...baseArgs,
          status: ZodValidationStatus.Failed,
          error: safeParse.error,
        });
      }
    }

    return validationResults;
  }

  validate<T extends ZodAnyDictionary>(
    patterns: T,
    params: Dictionary<any>,
  ): { success: boolean; errors: ZodValidationResult[] } {
    const results = this.getValidationResults(patterns, params);
    if (this.hasErrors(results)) {
      return {
        success: false,
        errors: this.getValidationErrors(results).map(
          ({ argName, arg, error }) => ({
            argName,
            arg,
            message: this.formatIssues(error!.errors),
          }),
        ),
      };
    }

    return { success: true, errors: [] };
  }
}

export default ZodValidator;
