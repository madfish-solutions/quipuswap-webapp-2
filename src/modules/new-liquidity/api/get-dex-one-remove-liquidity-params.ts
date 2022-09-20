import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { PoolType } from '../interfaces';

export const getDexOneRemoveLiquidityParams = async (
  tezos: TezosToolkit,
  contractAddress: string,
  poolType: PoolType,
  amountA: BigNumber,
  amountB: BigNumber,
  shares: BigNumber,
  transactionDeadline: string,
  id?: BigNumber
) => {
  const contractInstance = await tezos.wallet.at(contractAddress);

  switch (poolType) {
    case PoolType.TEZ_TOKEN:
      return contractInstance.methods.divestLiquidity(amountB, amountA, shares).toTransferParams();
    case PoolType.TOKEN_TOKEN:
      return contractInstance.methods.divest(id, amountA, amountB, shares, transactionDeadline).toTransferParams();
    default:
      throw Error('Invalid pool type');
  }
};
