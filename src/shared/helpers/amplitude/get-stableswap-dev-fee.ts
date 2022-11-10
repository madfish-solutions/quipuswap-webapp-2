import { TezosToolkit } from '@taquito/taquito';

import { PERCENTAGE_100, STABLESWAP_FEE_PRECISION, ZERO_AMOUNT_BN } from '@config/constants';
import { STABLESWAP_FACTORY_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { StableswapDevFee } from '@shared/types';

import { isNull } from '../type-checks';

export const getStableswapDevFee = async (tezos: Nullable<TezosToolkit>) => {
  if (isNull(tezos)) {
    return ZERO_AMOUNT_BN;
  }
  const { storage } = await getStorageInfo<StableswapDevFee>(tezos, STABLESWAP_FACTORY_CONTRACT_ADDRESS);

  return storage.dev_store.dev_fee_f.div(STABLESWAP_FEE_PRECISION).multipliedBy(PERCENTAGE_100);
};
