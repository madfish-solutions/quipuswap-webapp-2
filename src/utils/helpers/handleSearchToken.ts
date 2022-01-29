import { TezosToolkit } from '@taquito/taquito';

import { TEZOS_TOKEN } from '@app.config';
import { QSNetwork, WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

import { TokenNumber } from './handleTokenChange';
import { isTokenEqual } from './isTokenEqual';
import { localSearchSortSymbol } from './localSearchSortSymbol';
import { localSearchToken, WhitelistedOrCustomToken } from './localSearchToken';

const handleTokenPairSelect = (
  pair: WhitelistedTokenPair,
  setTokenPair: (pair: WhitelistedTokenPair) => void,
  handleTokenChange: (token: WhitelistedToken, tokenNum: TokenNumber) => void
) => {
  handleTokenChange(pair.token1, TokenNumber.FIRST);
  handleTokenChange(pair.token2, TokenNumber.SECOND);
  setTokenPair(pair);
};

interface SearchTokenType {
  tokens: WhitelistedToken[];
  tezos?: TezosToolkit;
  network: QSNetwork;
  from: string;
  to: string;
  fixTokenFrom?: WhitelistedToken;
  handleTokenChange: (token: WhitelistedToken, tokenNumber: TokenNumber) => void;
  setTokens: React.Dispatch<React.SetStateAction<WhitelistedToken[]>>;
  setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>;
  setUrlLoaded: React.Dispatch<React.SetStateAction<boolean>>;
  setTokenPair?: React.Dispatch<React.SetStateAction<WhitelistedTokenPair>>;
  searchCustomToken: (address: string, tokenId?: number, saveAfterSearch?: boolean) => Promise<WhitelistedToken | null>;
}

export const handleSearchToken = async ({
  tokens,
  network,
  tezos,
  from,
  to,
  fixTokenFrom,
  handleTokenChange,
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
      .filter(token => localSearchToken(token as WhitelistedOrCustomToken, network, inputValue, +inputToken));
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
      handleTokenChange(resTo, TokenNumber.SECOND);
    }
    let resFrom;
    if (!fixTokenFrom) {
      resFrom = await searchPart(from);
    } else {
      resFrom = fixTokenFrom;
    }
    res = [resFrom, ...res];
    handleTokenChange(resFrom, TokenNumber.FIRST);
  }
  setUrlLoaded(true);
  if (!isTokenEqual(res[0], res[1])) {
    setTokens(res);
    if (setTokenPair && tezos) {
      handleTokenPairSelect(
        { token1: res[0], token2: res[1] } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChange
      );
    }
  }
};
