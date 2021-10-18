import { useState, useEffect, useMemo } from 'react';

import { MAINNET_TOKENS, SAVED_LISTS_KEY, TESTNET_TOKENS } from '@utils/defaults';
import { QSNetwork, WhitelistedTokenList } from '@utils/types';
import { ipfsToHttps, isClient } from '@utils/helpers';

export const getSavedLists = () => (isClient ? JSON.parse(window.localStorage.getItem(SAVED_LISTS_KEY) || '{}') : []);

export const useGetLists = (network: QSNetwork) => {
  const [lists, setLists] = useState<WhitelistedTokenList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error] = useState<string>();
  const initialList = useMemo(() => (network.id === 'granadanet' ? TESTNET_TOKENS : MAINNET_TOKENS), [network.id]);

  useEffect(() => {
    const savedList = getSavedLists();
    const savedKeys = Object.keys(savedList);
    const uniqTokenList = initialList
      .split(' ')
      .concat(savedKeys)
      .filter(
        (value, index, self) => self.indexOf(value) === index,
      ); // get only unique lists by url
    const reqArr = uniqTokenList.map((x: string) => fetch(ipfsToHttps(x))
      .then((res) => res.json())
      .then((json) => json || [])
      .catch(() => []));
    const tempLists = uniqTokenList.map((x) => {
      const url = x;
      let enabled = !!savedList[url];
      if (savedList[url] === undefined && initialList.split(' ').some((y: string) => y === url)) {
        enabled = true;
      }
      return {
        error: false,
        loading: true,
        keywords: [],
        logoURI: '',
        name: url,
        tokens: [],
        enabled,
        url,
      };
    });
    setLists(tempLists);
    setLoading(true);
    reqArr.forEach((p, i) => {
      p.then((res) => {
        setLists((prevState: any) => {
          const listData = prevState.map((list: any, j: number) => {
            if (i === j) {
              const url = uniqTokenList[i];
              let enabled = !!savedList[url];
              if (savedList[url] === undefined && initialList.split(' ').find((y: string) => y === url)) {
                enabled = true;
              }
              const errorObj = Array.isArray(res);
              // setError(errorObj);
              return {
                error: errorObj,
                loading: false,
                keywords: res.keywords ?? [],
                logoURI: res.logoURI ?? '',
                name: res.name ?? url,
                tokens: res.tokens ?? [],
                enabled,
                url,
              };
            }
            return list;
          });
          return listData;
        });
        return null;
      });
    });
    setLoading(false);
  }, [initialList]);
  return { data: lists, loading, error };
};

export const saveCustomList = ({ key, val }: { key: string; val: boolean }) => {
  window.localStorage.setItem(SAVED_LISTS_KEY, JSON.stringify({ ...getSavedLists(), [key]: val }));
};

export const removeCustomList = (url: string) => {
  const savedList = getSavedLists();
  window.localStorage.setItem(
    SAVED_LISTS_KEY,
    JSON.stringify(
      Object.fromEntries(
        Object.keys(savedList)
          .filter((x) => x !== url)
          .map((x) => [x, savedList[x]]),
      ),
    ),
  );
};
