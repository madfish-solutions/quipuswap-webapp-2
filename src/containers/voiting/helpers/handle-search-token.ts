import { Dispatch, SetStateAction } from 'react';

import { TezosToolkit } from '@taquito/taquito';

import { NETWORK, TEZOS_TOKEN } from '@app.config';
import { isEmptyArray } from '@utils/helpers';
import { isTokenEqual } from '@utils/helpers/isTokenEqual';
import { localSearchSortSymbol } from '@utils/helpers/localSearchSortSymbol';
import { localSearchToken, WhitelistedOrCustomToken } from '@utils/helpers/localSearchToken';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

const getSearchPart =
  async (tokens: WhitelistedToken[], searchCustomToken: SearchCustomToken) =>
  async (str: string | string[]): Promise<WhitelistedToken> => {
    const strStr = Array.isArray(str) ? str[0] : str;
    const inputValue = strStr.split('_')[0];
    const inputToken = strStr.split('_')[1] ?? 0;
    const isTokens = tokens
      .sort((a, b) => localSearchSortSymbol(b, a, inputValue, inputToken))
      .filter(token => localSearchToken(token as WhitelistedOrCustomToken, NETWORK, inputValue, +inputToken));

    if (isEmptyArray(isTokens)) {
      return (await searchCustomToken(inputValue, +inputToken, true)) || TEZOS_TOKEN;
    }

    return isTokens[0];
  };

type SearchCustomToken = (
  address: string,
  tokenId?: number,
  saveAfterSearch?: boolean
) => Promise<WhitelistedToken | null>;

interface SearchTokenType {
  tokens: WhitelistedToken[];
  tezos?: TezosToolkit;
  from: string;
  to: string;
  fixTokenFrom?: WhitelistedToken;
  handleTokenChangeWrapper: (token: WhitelistedToken, tokenNumber: 'first' | 'second') => void;
  setTokens: Dispatch<SetStateAction<WhitelistedToken[]>>;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  setUrlLoaded: Dispatch<SetStateAction<boolean>>;
  setTokenPair: Dispatch<SetStateAction<WhitelistedTokenPair>>;
  searchCustomToken: SearchCustomToken;
}

export const handleSearchToken = async ({
  tokens,
  from,
  to,
  fixTokenFrom,
  handleTokenChangeWrapper,
  setTokens,
  setInitialLoad,
  setUrlLoaded,
  setTokenPair,
  searchCustomToken
}: SearchTokenType) => {
  setInitialLoad(true);
  setUrlLoaded(false);

  const searchPart = await getSearchPart(tokens, searchCustomToken);

  let res: WhitelistedToken[] = [];

  if (from) {
    if (to) {
      const resTo = await searchPart(to);
      res = [resTo];
      handleTokenChangeWrapper(resTo, 'second');
    }
    const resFrom = fixTokenFrom ? fixTokenFrom : await searchPart(from);
    res = [resFrom, ...res];
    handleTokenChangeWrapper(resFrom, 'first');
  }

  setUrlLoaded(true);

  if (!isTokenEqual(res[0], res[1])) {
    setTokens(res);
    const pair = { token1: res[0], token2: res[1] } as WhitelistedTokenPair;
    handleTokenChangeWrapper(pair.token1, 'first');
    handleTokenChangeWrapper(pair.token2, 'second');
    setTokenPair(pair);
  }
};
