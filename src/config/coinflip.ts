import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

import { DEFAULT_TOKEN, TEZOS_TOKEN } from './tokens';

export enum TOKEN_ASSETS {
  TEZOS,
  QUIPU
}

interface Asset {
  asset: TOKEN_ASSETS;
  token: Token;
}

export const tokenAssetsMap = new Map<string, Asset>([
  [getTokenSlug(TEZOS_TOKEN), { asset: TOKEN_ASSETS.TEZOS, token: TEZOS_TOKEN }],
  [getTokenSlug(DEFAULT_TOKEN), { asset: TOKEN_ASSETS.QUIPU, token: DEFAULT_TOKEN }]
]);
