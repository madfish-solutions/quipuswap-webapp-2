import { TezosToolkit } from '@taquito/taquito';

import { COINFLIP_CONTRACT_ADDRESS } from '@config/environment';
import { getStorageInfo } from '@shared/dapp';
import { isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

export const getCoinflipStorageApi = async <CoinFlipStorageType>(
  tezos: Nullable<TezosToolkit>
): Promise<Nullable<CoinFlipStorageType>> => {
  if (isNull(tezos)) {
    return null;
  }

  return await getStorageInfo<CoinFlipStorageType>(tezos, COINFLIP_CONTRACT_ADDRESS);
};
