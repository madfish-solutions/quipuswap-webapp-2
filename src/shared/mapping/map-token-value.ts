import BigNumber from 'bignumber.js';

import { DEFAULT_TOKEN_ID } from '@config/constants';
import { isTezosToken, isTokenFa2, saveBigNumber } from '@shared/helpers';
import { TezToken, TokenId, TokensValue } from '@shared/types';

export const mapTokensValue = (token: TokenId): TokensValue => {
  if (isTokenFa2(token)) {
    return {
      fa2: {
        token_address: token.contractAddress,
        token_id: saveBigNumber(token.fa2TokenId, new BigNumber(DEFAULT_TOKEN_ID))
      }
    };
  }

  if (isTezosToken(token)) {
    return { tez: Symbol() } as TezToken;
  }

  return {
    fa12: token.contractAddress
  };
};
