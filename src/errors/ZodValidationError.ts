import { ZodValidationResult } from 'types/Zod';

class ZodValidationError extends Error {
  constructor(
    private readonly eventName: any,
    private readonly errors: ZodValidationResult[],
  ) {
    super('The argument do not match provided patterns');
  }
}
export default ZodValidationError;
