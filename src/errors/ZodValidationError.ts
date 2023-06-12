class ZodValidationError extends Error {
  readonly eventName: string;
  readonly errors: string[];

  constructor(eventName: any, messages: string[]) {
    super("The arguments are not valid to provided ZOD patterns.");
    this.errors = messages;
    this.eventName = eventName;
    this.name = "ValidationError";
  }
}
export default ZodValidationError;
