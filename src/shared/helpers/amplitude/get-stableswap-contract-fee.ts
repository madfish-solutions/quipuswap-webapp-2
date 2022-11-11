import { TezosToolkit } from '@taquito/taquito';

import { PERCENTAGE_100, STABLESWAP_FEE_PRECISION, ZERO_AMOUNT, ZERO_AMOUNT_BN } from '@config/constants';
import { STABLESWAP_FACTORY_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { Pools, PartialStableswapFactoryContractField, PartialStableswapPoolContractField } from '@shared/types';

import { getSumOfNumbers } from '../bignumber';
import { isNull, isUndefined } from '../type-checks';

export const getStableswapContractFee = async (tezos: Nullable<TezosToolkit>, stableswapContracAddress: string) => {
  if (isNull(tezos)) {
    return ZERO_AMOUNT_BN;
  }

  const { storage: stableswapFactoryStorage } = await getStorageInfo<PartialStableswapFactoryContractField>(
    tezos,
    STABLESWAP_FACTORY_CONTRACT_ADDRESS
  );
  const { storage: stableswapPoolStorage } = await getStorageInfo<PartialStableswapPoolContractField>(
    tezos,
    stableswapContracAddress
  );
  const pools = await stableswapPoolStorage.pools.get<Pools>(ZERO_AMOUNT);

  if (isUndefined(pools)) {
    return ZERO_AMOUNT_BN;
  }

  const fee = pools.fee;
  const devFee = stableswapFactoryStorage.dev_store.dev_fee_f;

  const calcualatedFee = getSumOfNumbers(Object.values(fee)).plus(devFee);

  return calcualatedFee.dividedBy(STABLESWAP_FEE_PRECISION).multipliedBy(PERCENTAGE_100);
};
