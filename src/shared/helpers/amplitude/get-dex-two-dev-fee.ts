import { TezosToolkit } from '@taquito/taquito';

import { DEX_TWO_FEE_PRECISION, PERCENTAGE_100, ZERO_AMOUNT_BN } from '@config/constants';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { DexTwoFees } from '@shared/types/amplitude';

import { isNull } from '../type-checks';

export const getDexTwoDevFee = async (tezos: Nullable<TezosToolkit>) => {
  if (isNull(tezos)) {
    return ZERO_AMOUNT_BN;
  }
  const { storage } = await getStorageInfo<DexTwoFees>(tezos, DEX_TWO_CONTRACT_ADDRESS);

  return storage.fees.auction_fee
    .dividedBy(3)
    .multipliedBy(2)
    .dividedBy(DEX_TWO_FEE_PRECISION)
    .multipliedBy(PERCENTAGE_100);
};
