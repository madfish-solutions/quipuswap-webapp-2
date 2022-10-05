import { ContractAbstraction, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

export const getRemoveLiquidityParamsTezToken = (
  contract: ContractAbstraction<Wallet>,
  amountA: BigNumber,
  amountB: BigNumber,
  shares: BigNumber
) => {
  return contract.methods.divestLiquidity(amountB, amountA, shares).toTransferParams();
};
