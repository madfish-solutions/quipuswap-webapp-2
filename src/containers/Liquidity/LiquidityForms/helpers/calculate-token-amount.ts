import BigNumber from 'bignumber.js';

export const calculateTokenAmount = (
  tokenAInput: BigNumber,
  totalSupply: BigNumber,
  tokenAPool: BigNumber,
  tokenBPool: BigNumber
): BigNumber => {
  const shares = tokenAInput.multipliedBy(totalSupply).idiv(tokenAPool);

  return shares.multipliedBy(tokenBPool).idiv(totalSupply);
};
