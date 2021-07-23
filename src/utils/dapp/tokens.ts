import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
} from '@utils/defaults';
import { WhitelistedToken } from '@utils/types';

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
