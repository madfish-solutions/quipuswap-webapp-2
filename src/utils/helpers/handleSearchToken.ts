import { Dispatch, SetStateAction } from 'react';

import { TezosToolkit } from '@taquito/taquito';

import { TEZOS_TOKEN } from '@app.config';
import { QSNetwork, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { isTokenEqual } from './isTokenEqual';
import { localSearchSortSymbol } from './localSearchSortSymbol';
import { localSearchToken } from './localSearchToken';

interface SearchTokenType {
  tokens: WhitelistedToken[];
  tezos?: TezosToolkit;
  network: QSNetwork;
  from: string;
  to: string;
  fixTokenFrom?: WhitelistedToken;
  setTokens: Dispatch<SetStateAction<WhitelistedToken[]>>;
  setInitialLoad: Dispatch<SetStateAction<boolean>>;
  setUrlLoaded: Dispatch<SetStateAction<boolean>>;
  setTokenPair?: Dispatch<SetStateAction<WhitelistedTokenPair>>;
  searchCustomToken: (address: string, tokenId?: number, saveAfterSearch?: boolean) => Promise<WhitelistedToken | null>;
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
  const searchPart = async (str: string | string[]): Promise<WhitelistedToken> => {
    const strStr = Array.isArray(str) ? str[0] : str;
    const inputValue = strStr.split('_')[0];
    const inputToken = strStr.split('_')[1] ?? 0;
    const isTokens = tokens
      .sort((a, b) => localSearchSortSymbol(b, a, inputValue, inputToken))
      .filter(token => localSearchToken(token, network, inputValue, +inputToken));
    if (isTokens.length === 0) {
      return searchCustomToken(inputValue, +inputToken, true).then(x => {
        if (x) {
          return x;
        }

        return TEZOS_TOKEN;
      });
    }

    return isTokens[0];
  };
  let res: WhitelistedToken[] = [];
  if (from) {
    if (to) {
      const resTo = await searchPart(to);
      res = [resTo];
    }
    let resFrom;
    if (!fixTokenFrom) {
      resFrom = await searchPart(from);
    } else {
      resFrom = fixTokenFrom;
    }
    res = [resFrom, ...res];
  }
  setUrlLoaded(true);
  if (!isTokenEqual(res[0], res[1])) {
    setTokens(res);
    if (setTokenPair && tezos) {
      setTokenPair({ token1: res[0], token2: res[1] } as WhitelistedTokenPair);
    }
  }
};
