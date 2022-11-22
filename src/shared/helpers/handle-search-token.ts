import { Dispatch, SetStateAction } from 'react';

import { TezosToolkit } from '@taquito/taquito';

import { isNull, localSearchToken, TokenWithRequiredNetwork, localSearchSortSymbol } from '@shared/helpers';
import { isTokenEqual } from '@shared/helpers/tokens/is-token-equal';
import { Nullable, QSNetwork, Token, TokenPair } from '@shared/types';

import { NotFoundPairError } from './not-found-pair-error.error';

interface SearchTokenType {
  tokens: Token[];
  tezos?: TezosToolkit;
  network: QSNetwork;
  from: string;
  to: string;
  fixTokenFrom?: Token;
  setTokens: Dispatch<SetStateAction<Token[]>>;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  setUrlLoaded: Dispatch<SetStateAction<boolean>>;
  setTokenPair?: Dispatch<SetStateAction<Nullable<TokenPair>>>;
  searchCustomToken: (address: string, tokenId?: number, saveAfterSearch?: boolean) => Promise<Token | null>;
}

export const handleSearchToken = async ({
  tokens,
  network,
  tezos,
  from,
  to,
  fixTokenFrom,
  setTokens,
  setInitialLoad,
  setUrlLoaded,
  setTokenPair,
  searchCustomToken
}: // eslint-disable-next-line sonarjs/cognitive-complexity
SearchTokenType) => {
  setInitialLoad(true);
  setUrlLoaded(false);
  const searchPart = async (str: string | string[]): Promise<Nullable<Token>> => {
    const strStr = Array.isArray(str) ? str[0] : str;
    const inputValue = strStr.split('_')[0];
    const inputToken = strStr.split('_')[1] ?? 0;
    const isTokens = tokens
      .sort((a, b) => localSearchSortSymbol(b, a, inputValue, inputToken))
      .filter(token => localSearchToken(token as TokenWithRequiredNetwork, network, inputValue, +inputToken));
    if (isTokens.length === 0) {
      return searchCustomToken(inputValue, +inputToken, true);
    }

    return isTokens[0];
  };
  const tokenFrom = fixTokenFrom ?? (await searchPart(from));
  const tokenTo = await searchPart(to);
  setUrlLoaded(true);

  if (isNull(tokenFrom) || isNull(tokenTo)) {
    throw new NotFoundPairError(from, to);
  }

  if (!isTokenEqual(tokenFrom, tokenTo)) {
    setTokens([tokenFrom, tokenTo]);
    if (setTokenPair && tezos) {
      setTokenPair({ token1: tokenFrom, token2: tokenTo });
    }
  }
};
