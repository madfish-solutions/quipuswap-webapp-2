const TEMPLE_WALLET_NOT_INSTALLED_MESSAGE = 'Temple wallet not installed';

export class NoTempleWalletError extends Error {
  constructor() {
    super(TEMPLE_WALLET_NOT_INSTALLED_MESSAGE);
  }
}
