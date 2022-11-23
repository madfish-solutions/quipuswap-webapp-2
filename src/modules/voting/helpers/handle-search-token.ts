import { Dispatch, SetStateAction } from 'react';

import { TezosToolkit } from '@taquito/taquito';

import { DEFAULT_TOKEN_ID } from '@config/constants';
import {
  getFirstElement,
  getTokenAddress,
  isEmptyArray,
  isNull,
  localSearchToken,
  TokenWithRequiredNetwork,
  localSearchSortSymbol
} from '@shared/helpers';
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
}: SearchTokenType) => {
  setInitialLoad(true);
  setUrlLoaded(false);
  const searchToken = async (tokenSlug: string): Promise<Nullable<Token>> => {
    const { contractAddress: inputValue, fa2TokenId: inputToken = DEFAULT_TOKEN_ID } = getTokenAddress(tokenSlug);
    const isTokens = tokens
      .sort((a, b) => localSearchSortSymbol(b, a, inputValue, String(inputToken)))
      .filter(token => localSearchToken(token as TokenWithRequiredNetwork, network, inputValue, +inputToken));
    if (isEmptyArray(isTokens)) {
      return searchCustomToken(inputValue, +inputToken, true);
    }

    return getFirstElement(isTokens);
  };
  const tokenFrom = fixTokenFrom ?? (await searchToken(from));
  const tokenTo = await searchToken(to);
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
