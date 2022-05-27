import { NETWORK } from '@config/config';
import { TOKENS_KEY } from '@config/localstorage';
import { TEZOS_TOKEN } from '@config/tokens';

import { getTokenSlug, isTezosToken } from '../helpers';
import { TokenAddress } from '../types';

const DEFAULT_TOKEN_ID = 0;

export interface RawTokenMetadata {
  token_id?: string;
  name: string;
  symbol: string;
  decimals: number;
  thumbnailUri: string;
}

const getTokenFromLS = (tokenSlug: string): Nullable<RawTokenMetadata> => {
  try {
    const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}');

    return tokens[tokenSlug] ?? null;
  } catch (_) {
    return null;
  }
};

const saveTokenToLS = (tokenSlug: string, token: RawTokenMetadata) => {
  try {
    const tokens = JSON.parse(localStorage.getItem(TOKENS_KEY) || '{}');
    tokens[tokenSlug] = token;
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
  } catch (_) {
    //
  }
};

export const getTokenMetadata = async ({
  contractAddress,
  fa2TokenId
}: TokenAddress): Promise<RawTokenMetadata | null> => {
  if (isTezosToken({ contractAddress })) {
    return TEZOS_TOKEN.metadata;
  }

  const tokenSlug = getTokenSlug({
    contractAddress,
    fa2TokenId
  });
  const tokenFromLS = getTokenFromLS(tokenSlug);
  if (tokenFromLS) {
    return tokenFromLS;
  }

  return await fetch(`${NETWORK.metadata}/${contractAddress}/${fa2TokenId || DEFAULT_TOKEN_ID}`)
    .then(async res => {
      if (!res.ok) {
        return null;
      }
      const tokenFromServer: RawTokenMetadata = await res.json();
      if (tokenFromServer && tokenFromServer.decimals) {
        saveTokenToLS(tokenSlug, tokenFromServer);
      }

      return tokenFromServer;
    })
    .catch(() => null);
};
