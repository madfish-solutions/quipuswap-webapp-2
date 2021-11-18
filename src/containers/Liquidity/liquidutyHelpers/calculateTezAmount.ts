import BigNumber from 'bignumber.js';

export const calculateTezAmount = (
  amount:BigNumber,
  totalSupply: BigNumber,
  tokenPool: BigNumber,
  tezPool: BigNumber,
): BigNumber => {
  const shares = amount
    .multipliedBy(1_000_000)
    .multipliedBy(totalSupply)
    .dividedBy(tokenPool);
  const tezInput = shares
    .multipliedBy(tezPool)
    .dividedBy(totalSupply);

  return tezInput;
};
