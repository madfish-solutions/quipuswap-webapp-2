import { networksDefaultTokens, NETWORK_ID, TEZOS_TOKEN } from '@app.config';
import { getTokenSlug, isTezosToken } from '@utils/helpers';
import { Optional, Token } from '@utils/types';

const defaultToken = networksDefaultTokens[NETWORK_ID];

export const makeTokenPair = (token1: Optional<Token>, token2: Optional<Token>) => {
  const defaultToken1 = token2 && isTezosToken(token2) ? defaultToken : TEZOS_TOKEN;
  const defaultToken2 = token1 && getTokenSlug(token1) === getTokenSlug(defaultToken) ? TEZOS_TOKEN : defaultToken;

  return {
    token1: token1 ?? defaultToken1,
    token2: token2 ?? defaultToken2
  };
};
