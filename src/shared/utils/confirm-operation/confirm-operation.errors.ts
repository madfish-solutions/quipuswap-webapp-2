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

export class OperationRejectedError extends Error {
  constructor() {
    super('Sorry, the operation was rejected.  Please, try again');
  }
}
