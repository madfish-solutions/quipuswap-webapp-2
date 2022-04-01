export class ConfirmationTimeoutError extends Error {
  constructor() {
    super('Confirmation polling timed out');
  }
}

export class ConfirmPollingCanceledError extends Error {
  constructor() {
    super('Confirmation polling cancelled');
  }
}
