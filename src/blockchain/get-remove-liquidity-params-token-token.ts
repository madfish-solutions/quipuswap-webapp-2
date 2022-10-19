import { ContractAbstraction, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export const getRemoveLiquidityParamsTokenToken = (
  contract: ContractAbstraction<Wallet>,
  amountA: BigNumber,
  amountB: BigNumber,
  shares: BigNumber,
  transactionDeadline: string,
  id: BigNumber
) => {
  return contract.methods.divest(id, amountA, amountB, shares, transactionDeadline).toTransferParams();
};
