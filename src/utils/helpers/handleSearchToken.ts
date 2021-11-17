import { TezosToolkit } from '@taquito/taquito';

import { TEZOS_TOKEN } from '@utils/defaults';
import {
  QSNetwork, WhitelistedToken, WhitelistedTokenPair,
} from '@utils/types';
import { hanldeTokenPairSelect } from '@containers/Liquidity/liquidityHelpers';

import { isTokenEqual } from './isTokenEqual';
import { localSearchToken } from './localSearchToken';
import { localSearchSortSymbol } from './localSearchSortSymbol';

type SearchTokenType = {
  tokens: WhitelistedToken[]
  tezos?: TezosToolkit
  network: QSNetwork
  from: string
  to: string
  fixTokenFrom?: WhitelistedToken
  handleTokenChangeWrapper: (
    token: WhitelistedToken,
    tokenNumber: 'first' | 'second',) => void
  setTokens: React.Dispatch<React.SetStateAction<WhitelistedToken[]>>
  setInitialLoad: React.Dispatch<React.SetStateAction<boolean>>
  setUrlLoaded: React.Dispatch<React.SetStateAction<boolean>>
  setTokenPair?: React.Dispatch<React.SetStateAction<WhitelistedTokenPair>>
  searchCustomToken: (
    address: string,
    tokenId?: number,
    saveAfterSearch?:boolean,
  ) => Promise<WhitelistedToken | null>
};

export const handleSearchToken = async ({
  tokens,
  network,
  tezos,
  from,
  to,
  fixTokenFrom,
  handleTokenChangeWrapper,
  setTokens,
  setInitialLoad,
  setUrlLoaded,
  setTokenPair,
  searchCustomToken,
}:SearchTokenType) => {
  setInitialLoad(true);
  setUrlLoaded(false);
  const searchPart = async (str:string | string[]):Promise<WhitelistedToken> => {
    const strStr = Array.isArray(str) ? str[0] : str;
    const inputValue = strStr.split('_')[0];
    const inputToken = strStr.split('_')[1] ?? 0;
    const isTokens = tokens
      .sort((a, b) => localSearchSortSymbol(b, a, inputValue, inputToken))
      .filter(
        (token:any) => localSearchToken(
          token,
          network,
          inputValue,
          +inputToken,
        ),
      );
    if (isTokens.length === 0) {
      return searchCustomToken(inputValue, +inputToken, true).then((x) => {
        if (x) {
          return x;
        }
        return TEZOS_TOKEN;
      });
    }
    return isTokens[0];
  };
  let res:any[] = [];
  if (from) {
    if (to) {
      const resTo = await searchPart(to);
      res = [resTo];
      handleTokenChangeWrapper(resTo, 'second');
    }
    let resFrom;
    if (!fixTokenFrom) {
      resFrom = await searchPart(from);
    } else {
      resFrom = fixTokenFrom;
    }
    res = [resFrom, ...res];
    handleTokenChangeWrapper(resFrom, 'first');
  }
  setUrlLoaded(true);
  if (!isTokenEqual(res[0], res[1])) {
    setTokens(res);
    if (setTokenPair && tezos) {
      hanldeTokenPairSelect(
        { token1: res[0], token2: res[1] } as WhitelistedTokenPair,
        setTokenPair,
        handleTokenChangeWrapper,
      );
    }
  }
};
