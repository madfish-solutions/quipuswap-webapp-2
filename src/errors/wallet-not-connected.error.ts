const WALLET_NOT_CONNECTED_MESSAGE = 'Not connected';

export class WalletNotConnected extends Error {
  constructor() {
    super(WALLET_NOT_CONNECTED_MESSAGE);
  }
}
