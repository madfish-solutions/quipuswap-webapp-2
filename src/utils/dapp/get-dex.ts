import { findDex, FoundDex } from '@quipuswap/sdk';
import { Token } from '@quipuswap/sdk/src/types';
import { TezosToolkit } from '@taquito/taquito';

import { FACTORIES, NETWORK_ID } from '@app.config';
import { Nullable } from '@utils/types';

export const getDex = async (tezos: Nullable<TezosToolkit>, token: Token): Promise<Nullable<FoundDex>> => {
  if (!tezos) {
    return null;
  }

  return await findDex(tezos, FACTORIES[NETWORK_ID], token);
};
