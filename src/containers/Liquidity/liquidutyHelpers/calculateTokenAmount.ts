import BigNumber from 'bignumber.js';

export const calculateTokenAmount = (
  tokenAInput:BigNumber,
  totalSupply: BigNumber,
  tokenAPool: BigNumber,
  tokenBPool: BigNumber,
): BigNumber => {
  const shares = tokenAInput
    .multipliedBy(totalSupply)
    .dividedBy(tokenAPool);
  const tokenBOutput = shares
    .multipliedBy(tokenBPool)
    .dividedBy(totalSupply);

  return tokenBOutput;
};
