import { TezosToolkit } from '@taquito/taquito';
import {
  MAINNET_TOKENS,
  SAVED_TOKENS_KEY,
  TEZOS_TOKEN,
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
  network: QSNetwork,
  addTokensFromLocalStorage?:boolean,
) => {
  let networkTokens;
  if (network.id === 'mainnet') {
    networkTokens = await fetch(ipfsToHttps(MAINNET_TOKENS))
      .then((res) => res.json())
      .then((json) => {
        let res = [];
        if (json.tokens?.length !== 0) {
          res = json.tokens.map((x:WhitelistedToken) => ({ ...x, network: 'mainnet' }));
        }
        return res;
      })
      .catch(() => ([]));
  } else networkTokens = [TEZOS_TOKEN];
  let localhostTokens = [];
  if (addTokensFromLocalStorage) {
    localhostTokens = getSavedTokens();
  }
  const res = [...localhostTokens, ...networkTokens];
  return res;
};

export const saveCustomToken = (token:WhitelistedToken) => {
  window.localStorage.setItem(
    SAVED_TOKENS_KEY,
    JSON.stringify([...getSavedTokens(), token]),
  );
};
