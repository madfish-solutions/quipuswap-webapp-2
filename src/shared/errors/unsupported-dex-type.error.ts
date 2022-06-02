const ERROR_MESSAGE = 'Unsupported Dex Type';

export class UnsupportedDexType extends Error {
  constructor() {
    super(ERROR_MESSAGE);
  }
}
