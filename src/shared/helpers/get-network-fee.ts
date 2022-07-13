import { TezosToolkit } from '@taquito/taquito';

import { getCoinflipStorageApi } from '@modules/coinflip/api';
import { CoinflipStorage } from '@modules/coinflip/api/types';

const DECIMAL_PRECISION = 1e6;

export const getNetworkFee = async (tezos: Nullable<TezosToolkit>) => {
  const storage: Nullable<CoinflipStorage> = await getCoinflipStorageApi(tezos);

  return storage?.network_fee?.div(DECIMAL_PRECISION);
};
