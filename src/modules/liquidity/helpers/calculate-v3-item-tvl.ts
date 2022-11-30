import BigNumber from 'bignumber.js';

export const calculateV3ItemTvl = (
  tokenXBalance: BigNumber,
  tokenYBalance: BigNumber,
  tokenXExchangeRate: BigNumber,
  tokenYExchangeRate: BigNumber
) => tokenXBalance.multipliedBy(tokenXExchangeRate).plus(tokenYBalance.multipliedBy(tokenYExchangeRate));
