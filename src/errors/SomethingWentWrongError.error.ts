const ERROR_MESSAGE = 'Something went wrong';

export class SomethingWentWrongError extends Error {
  constructor() {
    super(ERROR_MESSAGE);
  }
}
