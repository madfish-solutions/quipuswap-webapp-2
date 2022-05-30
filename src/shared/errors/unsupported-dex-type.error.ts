const ERROR_MESSAGE = 'Temple wallet not installed';

export class UnsupportedDexType extends Error {
  constructor() {
    super(ERROR_MESSAGE);
  }
}
