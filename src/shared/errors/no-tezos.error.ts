const NO_TEZOS_ERROR_MESSAGE = 'No Tezos';

export class NoTezosError extends Error {
  constructor() {
    super(NO_TEZOS_ERROR_MESSAGE);
  }
}
