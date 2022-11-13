import { TezosToolkit } from '@taquito/taquito';

import { DEX_TWO_FEE_PRECISION, PERCENTAGE_100, ZERO_AMOUNT_BN } from '@config/constants';
import { DEX_TWO_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { Nullable, PartialDexTwoFees } from '@shared/types';

import { isNull } from '../type-checks';

const FRACTIONAL_PART = 2;
const WHOLE_PART = 3;

export const getDexTwoDevFee = async (tezos: Nullable<TezosToolkit>) => {
  if (isNull(tezos)) {
    return ZERO_AMOUNT_BN;
  }
  const { storage } = await getStorageInfo<PartialDexTwoFees>(tezos, DEX_TWO_CONTRACT_ADDRESS);

  return storage.fees.auction_fee
    .dividedBy(WHOLE_PART)
    .multipliedBy(FRACTIONAL_PART)
    .dividedBy(DEX_TWO_FEE_PRECISION)
    .multipliedBy(PERCENTAGE_100);
};
