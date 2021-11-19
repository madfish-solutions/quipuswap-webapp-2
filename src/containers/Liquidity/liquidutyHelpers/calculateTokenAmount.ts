import BigNumber from 'bignumber.js';

export const calculateTokenAmount = (
  amount:BigNumber,
  totalSupply: BigNumber,
  tokenAPool: BigNumber,
  tokenBPool: BigNumber,
): BigNumber => {
  const shares = amount
    .multipliedBy(1_000_000)
    .multipliedBy(totalSupply)
    .dividedBy(tokenAPool);
  const tokenInput = shares
    .multipliedBy(tokenBPool)
    .dividedBy(totalSupply);

  return tokenInput;
};
