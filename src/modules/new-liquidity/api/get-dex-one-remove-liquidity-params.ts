import { ContractAbstraction, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getRemoveLiquidityParamsTezToken, getRemoveLiquidityParamsTokenToken } from '@blockchain';
import { DEFAULT_TOKEN_ID_BN } from '@config/constants';

import { PoolType } from '../interfaces';

export const getDexOneRemoveLiquidityParams = async (
  contract: ContractAbstraction<Wallet>,
  poolType: PoolType,
  amountA: BigNumber,
  amountB: BigNumber,
  shares: BigNumber,
  transactionDeadline: string,
  id: BigNumber = DEFAULT_TOKEN_ID_BN
) => {
  switch (poolType) {
    case PoolType.TEZ_TOKEN:
      return getRemoveLiquidityParamsTezToken(contract, amountA, amountB, shares);
    case PoolType.TOKEN_TOKEN:
      return getRemoveLiquidityParamsTokenToken(contract, amountA, amountB, shares, transactionDeadline, id);
    default:
      throw Error('Invalid pool type');
  }
};
