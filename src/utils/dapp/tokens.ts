import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
} from '@utils/defaults';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';

export const getSavedTokens = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : []);

export const getTokens = async (addTokensFromLocalStorage?:boolean) => fetch(MAINNET_TOKENS.replace('ipfs://', 'https://ipfs.io/ipfs/'))
  .then((res) => res.json())
  .then((json) => {
    let res = [];
    if (!(json.tokens && json.tokens.length === 0)) {
      res = json.tokens.map((x:WhitelistedToken) => ({ ...x, network: 'mainnet' }));
    }
    if (addTokensFromLocalStorage) {
      res = [...res, ...getSavedTokens()];
    }
    return res;
  })
  .catch(() => ([]));

export const saveCustomToken = (token:WhitelistedToken) => {
  window.localStorage.setItem(
    SAVED_TOKENS_KEY,
    JSON.stringify([...getSavedTokens(), token]),
  );
};

// generate cortege of uniq pairs of token1 repo and token2 repo
// export const mergeTokensToPair = (tokens1, tokens2) =>
// [{token1[0]:tokens2[0]},{token1[1]:tokens2[0]},{token1[2]:tokens2[0]},{token1[0]:tokens2[1]},...]

export const mergeTokensToPair = (
  tokens1:WhitelistedToken[],
  tokens2:WhitelistedToken[],
):WhitelistedTokenPair[] => {
  const res = { token1: tokens1[0], token2: tokens2[0] } as WhitelistedTokenPair;
  return [res];
};
