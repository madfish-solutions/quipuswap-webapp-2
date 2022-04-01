const NO_BEACON_WALLET_MESSAGE = 'Cannot use beacon out of window';

export class NoBeaconWallet extends Error {
  constructor() {
    super(NO_BEACON_WALLET_MESSAGE);
  }
}
