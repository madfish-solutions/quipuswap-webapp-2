import { TezosToolkit } from '@taquito/taquito';
import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
} from '@utils/defaults';
import { isContractAddress } from '@utils/validators';
import { ipfsToHttps } from '@utils/helpers';

export const getSavedTokens = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : []);

export const getContractInfo = (address:string, tz:TezosToolkit) => tz
  ?.contract
  .at(address);

export const isTokenFa2 = async (address:string, tz:TezosToolkit) => {
  if (isContractAddress(address)) {
    let type;
    try {
      type = await getContractInfo(address, tz);
    } catch (e) {
      type = null;
    }
    if (!type) return false;
    const isFa2 = !!type.methods.update_operators;
    return isFa2;
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
      res = json.tokens;
    }
    if (addTokensFromLocalStorage) {
      res = [...res, ...getSavedTokens()];
    }
    return res;
  })
  .catch(() => ([]));
