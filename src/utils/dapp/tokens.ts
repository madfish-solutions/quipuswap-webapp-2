import { TezosToolkit } from '@taquito/taquito';
import memoizee from 'memoizee';
import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
  TESTNET_TOKENS,
  TEZOS_TOKEN,
} from '@utils/defaults';
import {
  WhitelistedToken, WhitelistedTokenPair, QSNetwork,
} from '@utils/types';

import { isContractAddress } from '@utils/validators';
import { ipfsToHttps, isTokenEqual } from '@utils/helpers';

export const getSavedTokens = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : []);

export const getContractInfo = (address:string, tz:TezosToolkit) => tz
  ?.contract
  .at(address);

export const isTokenFa2 = memoizee(
  async (address:string, tz:TezosToolkit) => {
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
  },
  { promise: true },
);

export const getTokens = async (
  network:QSNetwork,
  addTokensFromLocalStorage?:boolean,
) => fetch(ipfsToHttps(network.id === 'granadanet' ? TESTNET_TOKENS : MAINNET_TOKENS))
  .then((res) => res.json())
  .then((json) => {
    let res: any[] = [];
    if (json.tokens?.length !== 0) {
      res = json.tokens;
    }
    if (!res.some(({ contractAddress }) => contractAddress === TEZOS_TOKEN.contractAddress)) {
      res.unshift({
        network,
        type: 'fa1.2',
        contractAddress: 'tez',
        metadata: {
          decimals: 6,
          name: 'Tezos',
          symbol: 'TEZ',
          thumbnailUri: 'https://ipfs.io/ipfs/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222',
        },
      });
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
    JSON.stringify([token, ...getSavedTokens()
      .filter((x:WhitelistedToken) => !isTokenEqual(x, token))]),
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
