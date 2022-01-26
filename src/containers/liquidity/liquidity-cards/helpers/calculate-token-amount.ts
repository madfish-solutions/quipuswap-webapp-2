import BigNumber from 'bignumber.js';

export const calculateTokenAmount = (tokenAPool: BigNumber, tokenBPool: BigNumber): BigNumber =>
  tokenBPool.div(tokenAPool);
