const WALLET_NOT_CONNECTED_MESSAGE = 'Unexpected Empty Value';

export class UnexpectedEmptyValueError extends Error {
  constructor(message?: string) {
    super(message ? `${WALLET_NOT_CONNECTED_MESSAGE}: ${message}` : WALLET_NOT_CONNECTED_MESSAGE);
  }
}
