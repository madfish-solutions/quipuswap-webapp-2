import { ContractAbstraction, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { BigMap } from '@shared/types';

interface ITokenTokenPool {
  token_a_pool: BigNumber;
  token_b_pool: BigNumber;
  total_supply: BigNumber;
}

interface ITokenTokenStorage {
  storage: {
    pairs: BigMap<BigNumber, ITokenTokenPool>;
  };
}

export const fetchTokenTokenPoolReserves = async (contractInstance: ContractAbstraction<Wallet>, poolId: BigNumber) => {
  const accordanceStorageToken = await contractInstance.storage<ITokenTokenStorage>();
  const pair = await accordanceStorageToken.storage.pairs.get(poolId);

  return {
    aTokenAtomicTvl: pair?.token_a_pool ?? ZERO_AMOUNT_BN,
    bTokenAtomicTvl: pair?.token_b_pool ?? ZERO_AMOUNT_BN,
    totalLpSupply: pair?.total_supply ?? ZERO_AMOUNT_BN
  };
};
