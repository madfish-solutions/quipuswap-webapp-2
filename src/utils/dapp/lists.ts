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
  const savedList = getSavedLists();
  const savedKeys = Object.keys(savedList);
  const objArr = [...(initialList.split(' ')), ...savedKeys]
    .filter((value, index, self) => self.indexOf(value) === index); // get only unique
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
  const transformedResult = result.map((x, i) => {
    const url = objArr[i];
    let enabled = !!savedList[url];
    if (savedList[url] === undefined && initialList.split(' ').find((y:string) => y === url)) {
      enabled = true;
    }
    return ({
      error: x.status === 'rejected',
      loading: false,
      keywords: x.status === 'fulfilled' ? x.value.keywords : [],
      logoURI: x.status === 'fulfilled' ? x.value.logoURI : '',
      name: x.status === 'fulfilled' ? x.value.name : objArr[i],
      tokens: x.status === 'fulfilled' ? x.value.tokens : [],
      enabled,
      url,
    });
  });
  console.log('[load lists]', result);
  console.log('[load transformedResult]', transformedResult);
  return transformedResult;
};

export const saveCustomList = ({ key, val }: { key:string, val:boolean }) => {
  window.localStorage.setItem(
    SAVED_LISTS_KEY,
    JSON.stringify({ ...getSavedLists(), [key]: val }),
  );
};
