import {
  MAINNET_TOKENS,
  SAVED_LISTS_KEY,
  TESTNET_TOKENS,
} from '@utils/defaults';
import {
  QSNetwork,
} from '@utils/types';
import { ipfsToHttps } from '@utils/helpers';

export const getSavedLists = () => (typeof window !== undefined ? JSON.parse(window.localStorage.getItem(SAVED_LISTS_KEY) || '{}') : []);

export const getLists = async (
  network:QSNetwork,
) => {
  const initialList = network.id === 'granadanet' ? TESTNET_TOKENS : MAINNET_TOKENS;
  const objArr = [...initialList.split(' '), ...Object.keys(getSavedLists())];
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
    url: objArr[i],
  }));
};

export const saveCustomList = ({ key, val }: { key:string, val:boolean }) => {
  window.localStorage.setItem(
    SAVED_LISTS_KEY,
    JSON.stringify({ ...getSavedLists(), [key]: val }),
  );
};
