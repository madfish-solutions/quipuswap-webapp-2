const ERROR_MESSAGE = 'Something went wrong';

export class SomethingWentWrong extends Error {
  constructor() {
    super(ERROR_MESSAGE);
  }
}
