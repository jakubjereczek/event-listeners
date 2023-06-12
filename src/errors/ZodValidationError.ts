class ZodValidationError extends Error {
  readonly eventName: string;
  readonly errors: string[];

  constructor(eventName: any, messages: string[]) {
    super('The argument do not match provided patterns');
    this.errors = messages;
    this.eventName = eventName;
  }
}
export default ZodValidationError;
