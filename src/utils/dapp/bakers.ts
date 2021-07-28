import {
  MAINNET_BAKERS,
  SAVED_BAKERS_KEY,
} from '@utils/defaults';
import { ipfsToHttps } from '@utils/helpers';
import { WhitelistedBaker } from '@utils/types';

export const getSavedBakers = () => (
  typeof window !== undefined
    ? JSON.parse(window.localStorage.getItem(SAVED_BAKERS_KEY) || '[]')
    : []
);

export const saveCustomBaker = (baker:WhitelistedBaker) => window.localStorage.setItem(
  SAVED_BAKERS_KEY,
  JSON.stringify([...getSavedBakers(), baker]),
);

export const getBakers = async (
  addBakersFromLocalStorage?:boolean,
) => fetch(ipfsToHttps(MAINNET_BAKERS))
  .then((res) => res.json())
  .then((json) => {
    let res = [];
    if (!(json.bakers && json.bakers.length === 0)) {
      res = json.bakers;
    }
    if (addBakersFromLocalStorage) {
      res = [...res, ...getSavedBakers()];
    }
    return res;
  })
  .catch(() => ([]));
