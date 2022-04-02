export class SwapFeeNotEnoughParametersError extends Error {
  constructor() {
    super('Input amount and exchangers chain should be specified. Also wallet should be connected');
  }
}
