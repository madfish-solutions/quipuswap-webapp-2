import { TezosToolkit } from '@taquito/taquito';

import { TOKEN_DECIMALS_PRECISION } from '@config/constants';
import { getCoinflipStorageApi } from '@modules/coinflip/api';
import { CoinflipStorage } from '@modules/coinflip/api/types';
import { Nullable } from '@shared/types';

export const getNetworkFee = async (tezos: Nullable<TezosToolkit>) => {
  const storage: Nullable<CoinflipStorage> = await getCoinflipStorageApi(tezos);

  return storage?.network_fee?.div(TOKEN_DECIMALS_PRECISION);
};
