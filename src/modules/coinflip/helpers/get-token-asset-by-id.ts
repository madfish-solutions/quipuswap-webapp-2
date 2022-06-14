import { isTezosToken } from '@shared/helpers';
import { Token } from '@shared/types';

import { TOKEN_ASSETS } from '../api/types';

export const getTokenAssetId = (token: Token) => {
  if (isTezosToken(token)) {
    return TOKEN_ASSETS.TEZOS;
  }

  return TOKEN_ASSETS.QUIPU;
};
