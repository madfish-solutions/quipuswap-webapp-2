import { ContractAbstraction, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { PoolType } from '../interfaces';

export const getDexOneRemoveLiquidityParams = async (
  contract: ContractAbstraction<Wallet>,
  poolType: PoolType,
  amountA: BigNumber,
  amountB: BigNumber,
  shares: BigNumber,
  transactionDeadline: string,
  id?: BigNumber
) => {
  switch (poolType) {
    case PoolType.TEZ_TOKEN:
      return contract.methods.divestLiquidity(amountB, amountA, shares).toTransferParams();
    case PoolType.TOKEN_TOKEN:
      return contract.methods.divest(id, amountA, amountB, shares, transactionDeadline).toTransferParams();
    default:
      throw Error('Invalid pool type');
  }
};
