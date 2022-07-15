import { TezosToolkit } from '@taquito/taquito';

import { TOKEN_DECIMALS_PRECISION } from '@config/config';
import { getCoinflipStorageApi } from '@modules/coinflip/api';
import { CoinflipStorage } from '@modules/coinflip/api/types';

export const getNetworkFee = async (tezos: Nullable<TezosToolkit>) => {
  const storage: Nullable<CoinflipStorage> = await getCoinflipStorageApi(tezos);

  return storage?.network_fee?.div(TOKEN_DECIMALS_PRECISION);
};
