const WALLET_NOT_CONNECTED_MESSAGE = 'Not connected';

export class WalletNotConected extends Error {
  constructor() {
    super(WALLET_NOT_CONNECTED_MESSAGE);
  }
}
