import {
  MAINNET_TOKENS,
  SAVED_LISTS_KEY,
  SAVED_LISTS_STATE,
  TESTNET_TOKENS,
} from '@utils/defaults';
import {
  QSNetwork, WhitelistedTokenList,
} from '@utils/types';
import { ipfsToHttps } from '@utils/helpers';

export const getSavedLists = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_LISTS_KEY) || '[]') : []);
export const getSavedState = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_LISTS_STATE) || '{}') : []);

export const getLists = async (
  network:QSNetwork,
) => {
  const initialList = network.id === 'granadanet' ? TESTNET_TOKENS : MAINNET_TOKENS;
  const objArr = [...initialList.split(' '), ...getSavedLists()];
  const reqArr = objArr.map((x:string) => fetch(ipfsToHttps(x))
    .then((res) => res.json())
    .then((json) => {
      let res = [];
      if (json) {
        res = json;
      }
      return res;
    })
    .catch(() => ([])));
  const result = await Promise.allSettled(reqArr);
  return result.map((x, i) => ({
    error: x.status === 'rejected',
    loading: false,
    keywords: x.status === 'fulfilled' ? x.value.keywords : [],
    logoURI: x.status === 'fulfilled' ? x.value.logoURI : '',
    name: x.status === 'fulfilled' ? x.value.name : objArr[i],
    tokens: x.status === 'fulfilled' ? x.value.tokens : [],
    url: objArr[i] && objArr[i].url ? objArr[i].url : objArr[i],
  }));
};

export const saveCustomList = (list:WhitelistedTokenList) => {
  window.localStorage.setItem(
    SAVED_LISTS_KEY,
    JSON.stringify([list, ...getSavedLists()
      .filter((x:WhitelistedTokenList) => x.name !== list.name)]),
  );
};

export const savedListsState = ({ key, val }: { key:string, val:boolean }) => {
  window.localStorage.setItem(
    SAVED_LISTS_STATE,
    JSON.stringify({ ...getSavedState(), [key]: val }),
  );
};
