import BigNumber from 'bignumber.js';

export const calculateTokenAmount = (
  amount:BigNumber,
  totalSupply: BigNumber,
  tezPool: BigNumber,
  tokenPool: BigNumber,
): BigNumber => {
  const shares = amount
    .multipliedBy(1_000_000)
    .multipliedBy(totalSupply)
    .dividedBy(tezPool);
  const tokenInput = shares
    .multipliedBy(tokenPool)
    .dividedBy(totalSupply);

  return tokenInput;
};
