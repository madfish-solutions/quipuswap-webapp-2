import { TezosToolkit } from '@taquito/taquito';
import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
} from '@utils/defaults';
import { WhitelistedToken, WhitelistedTokenPair } from '@utils/types';
import { isContractAddress } from '@utils/validators';
import { ipfsToHttps } from '@utils/helpers';

export const getSavedTokens = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : []);

export const getContractInfo = (address:string, tz:TezosToolkit) => tz
  ?.contract
  .at(address);

export const isTokenFa2 = async (address:string, tz:TezosToolkit) => {
  if (await isContractAddress(address) === true) {
    let type;
    try {
      type = await getContractInfo(address, tz);
    } catch (e) {
      type = null;
    }
    if (!type) return false;
    return !!type.methods.update_operators;
  }
  return false;
};

export const getTokens = async (
  addTokensFromLocalStorage?:boolean,
) => fetch(ipfsToHttps(MAINNET_TOKENS))
  .then((res) => res.json())
  .then((json) => {
    let res = [];
    if (json.tokens?.length !== 0) {
      res = json.tokens.map((x:WhitelistedToken) => ({ ...x, network: 'mainnet' }));
    }
    if (addTokensFromLocalStorage) {
      res = [...getSavedTokens(), ...res];
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
