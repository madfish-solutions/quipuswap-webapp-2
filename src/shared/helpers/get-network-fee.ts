import { TezosToolkit } from '@taquito/taquito';

import { DEFAULT_TOKEN_DECIMALS_PRECISION } from '@config/tokens';
import { getCoinflipStorageApi } from '@modules/coinflip/api';
import { CoinflipStorage } from '@modules/coinflip/api/types';

export const getNetworkFee = async (tezos: Nullable<TezosToolkit>) => {
  const storage: Nullable<CoinflipStorage> = await getCoinflipStorageApi(tezos);

  return storage?.network_fee?.div(DEFAULT_TOKEN_DECIMALS_PRECISION);
};
