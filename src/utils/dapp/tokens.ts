import { TezosToolkit } from '@taquito/taquito';
import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
  TESTNET_TOKENS,
} from '@utils/defaults';
import { WhitelistedToken, QSNetwork } from '@utils/types';

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
  network:QSNetwork,
  addTokensFromLocalStorage?:boolean,
) => fetch(ipfsToHttps(network.id === 'florencenet' ? TESTNET_TOKENS : MAINNET_TOKENS))
  .then((res) => res.json())
  .then((json) => {
    let res = [];
    if (json.tokens?.length !== 0) {
      res = json.tokens;
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
    JSON.stringify([token, ...getSavedTokens()]),
  );
};
