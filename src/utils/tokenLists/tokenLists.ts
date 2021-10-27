import { useState, useEffect, useMemo, useCallback } from 'react';
import constate from 'constate';

import {
  CUSTOM_SAVED_TOKEN_LIST_KEY,
  MAINNET_NETWORK,
  MAINNET_TOKENS,
  METADATA_API_MAINNET,
  METADATA_API_TESTNET,
  STABLE_TOKEN,
  TESTNET_TOKENS,
} from '@utils/defaults';
import { WhitelistedToken, WhitelistedTokenList } from '@utils/types';
import { ipfsToHttps } from '@utils/helpers';
import { useNetwork, useTezos } from '@utils/dapp';
import { isContractAddress } from '@utils/validators';

import { getSavedLists } from './getSavedLists';
import { saveCustomList } from './saveCustomList';
import { getContractInfo, saveCustomToken } from './tokens';
import { getTokenMetadata } from './tokensMetadata';
import { removeCustomList } from './removeCustomList';

export type TokenListsType = {
  lists: { data: WhitelistedTokenList[]; loading: boolean; error?: string };
  searchTokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
  searchLists: { data: WhitelistedTokenList[]; loading: boolean; error?: string };
};

function useTokenLists() {
  const [{ lists, searchTokens, searchLists }, setState] = useState<TokenListsType>({
    lists: { loading: true, data: [] },
    searchTokens: { loading: false, data: [] },
    searchLists: { loading: false, data: [] },
  });

  const network = useNetwork();
  const tezos = useTezos();
  const initialList = useMemo(
    () => (network.id === 'granadanet' ? TESTNET_TOKENS : MAINNET_TOKENS),
    [network.id],
  );

  useEffect(() => {
    const savedList = getSavedLists();
    const savedKeys = Object.keys(savedList);
    const uniqTokenList = initialList
      .split(' ')
      .concat(savedKeys)
      .filter((value, index, self) => self.indexOf(value) === index); // get only unique lists by url
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
    setState((prevState) => ({ ...prevState, lists: { loading: true, data: tempLists } }));
    uniqTokenList.map((x: string, i) =>
      fetch(ipfsToHttps(x))
        .then((res) => res.json())
        .then((json) => json || [])
        .then((res) => {
          setState((prevState: any) => {
            const newState = prevState.lists.data;
            const url = uniqTokenList[i];
            let enabled = !!savedList[url];
            if (
              savedList[url] === undefined &&
              initialList.split(' ').find((y: string) => y === url)
            ) {
              enabled = true;
            }
            const errorObj = Array.isArray(res);
            newState[i] = {
              error: errorObj,
              loading: false,
              keywords: res.keywords ?? [],
              logoURI: res.logoURI ?? '',
              name: res.name ?? url,
              tokens: res.tokens ?? [],
              enabled,
              url,
            };
            return {
              ...prevState,
              lists: { loading: false, data: newState },
            };
          });
        })
        .catch(() => []),
    );
  }, [initialList]);

  const addCustomToken = useCallback((token: WhitelistedToken) => {
    saveCustomToken(token);
    setState((prevState) => {
      let listData = prevState.lists.data;
      const listWithCustomTokens = listData.some((x) => x.url === CUSTOM_SAVED_TOKEN_LIST_KEY);
      if (!listWithCustomTokens) {
        listData = listData.map((x) =>
          x.url === CUSTOM_SAVED_TOKEN_LIST_KEY ? { ...x, tokens: [token, ...x.tokens] } : x,
        );
      } else {
        listData = listData.concat({
          name: CUSTOM_SAVED_TOKEN_LIST_KEY,
          tokens: [token],
          enabled: true,
          url: CUSTOM_SAVED_TOKEN_LIST_KEY,
          keywords: [],
          logoURI: STABLE_TOKEN.metadata.thumbnailUri,
        });
      }
      return {
        ...prevState,
        lists: { ...prevState.lists, data: listData },
        searchTokens: { loading: false, data: [] },
      };
    });
  }, []);

  const addCustomList = useCallback(
    (list: WhitelistedTokenList, url: string) => {
      saveCustomList({ key: url, val: true });
      setState((prevState) => ({
        ...prevState,
        lists: { ...lists, data: [...lists.data, list] },
      }));
    },
    [lists],
  );

  const searchCustomList = useCallback(
    async (url: string): Promise<WhitelistedTokenList | null> => {
      const httpUrl = ipfsToHttps(url);
      if (!httpUrl.startsWith('https://ipfs.io/ipfs/')) {
        setState((prevState) => ({
          ...prevState,
          searchLists: { loading: false, data: [] },
        }));
        return null;
      }
      setState((prevState) => ({
        ...prevState,
        searchLists: { loading: true, data: [] },
      }));
      const result = await fetch(httpUrl)
        .then((res) => res.json())
        .then((json) => json || [])
        .catch(() => null);

      if (result === null) {
        setState((prevState) => ({
          ...prevState,
          searchLists: { loading: false, data: [] },
        }));
        return null;
      }
      const transformedResult = {
        error: false,
        loading: false,
        keywords: result.keywords || [],
        logoURI: result.logoURI || '',
        name: result.name || url,
        tokens: result.tokens || [],
        enabled: false,
        url,
      };
      setState((prevState) => ({
        ...prevState,
        searchLists: { loading: false, data: [transformedResult] },
      }));
      return transformedResult;
    },
    [],
  );

  const searchCustomToken = useCallback(
    async (
      address: string,
      tokenId?: number,
      saveAfterSearch?: boolean,
    ): Promise<WhitelistedToken | null> => {
      if ((await isContractAddress(address)) === true) {
        setState((prevState) => ({
          ...prevState,
          searchTokens: { loading: true, data: [] },
        }));
        let type;
        try {
          type = await getContractInfo(address, tezos!!);
        } catch (e) {
          type = null;
        }
        if (!type) {
          setState((prevState) => ({
            ...prevState,
            searchTokens: { loading: false, data: [] },
          }));
          return null;
        }
        const isFa2 = !!type.methods.update_operators;
        const customToken = await getTokenMetadata(
          network.id === MAINNET_NETWORK.id ? METADATA_API_MAINNET : METADATA_API_TESTNET,
          address,
          tokenId,
        );
        if (!customToken) {
          setState((prevState) => ({
            ...prevState,
            searchTokens: { loading: false, data: [] },
          }));
          return null;
        }
        const token: WhitelistedToken = {
          contractAddress: address,
          metadata: customToken,
          type: !isFa2 ? 'fa1.2' : 'fa2',
          fa2TokenId: !isFa2 ? undefined : tokenId || 0,
          network: network.id,
        } as WhitelistedToken;
        setState((prevState) => ({
          ...prevState,
          searchTokens: { loading: false, data: [token] },
        }));
        if (saveAfterSearch) saveCustomToken(token);
        return token;
      }
      return null;
    },
    [tezos, network],
  );

  const toggleList = useCallback(
    (url: string) => {
      let isEnabled = false;
      const newData = (lists.data ?? []).concat(searchLists.data).map((x: WhitelistedTokenList) => {
        if (x.url === url) {
          if (searchLists.data.length > 0) {
            isEnabled = true;
          } else {
            isEnabled = !x.enabled;
          }
        }
        return x.url === url ? { ...x, enabled: isEnabled } : x;
      });
      saveCustomList({ key: url, val: isEnabled });

      setState((prevState) => ({
        ...prevState,
        lists: { loading: false, data: newData },
        searchLists: { loading: false, data: [] },
      }));
    },
    [lists, searchLists],
  );

  const removeList = useCallback(
    (url: string) => {
      const newData = (lists.data ?? []).filter((x: WhitelistedTokenList) => x.url !== url);
      removeCustomList(url);

      setState((prevState) => ({
        ...prevState,
        lists: { loading: false, data: newData },
        searchLists: { loading: false, data: [] },
      }));
    },
    [lists],
  );

  return {
    searchTokens,
    lists,
    searchLists,
    addCustomToken,
    searchCustomToken,
    addCustomList,
    searchCustomList,
    toggleList,
    removeList,
  };
}

export const [
  TokenListsProvider,
  useSearchTokens,
  useLists,
  useSearchLists,
  useToggleList,
  useRemoveList,
  useAddCustomToken,
  useSearchCustomTokens,
  useAddCustomLists,
  useSearchCustomLists,
] = constate(
  useTokenLists,
  (v) => v.searchTokens,
  (v) => v.lists,
  (v) => v.searchLists,
  (v) => v.toggleList,
  (v) => v.removeList,
  (v) => v.addCustomToken,
  (v) => v.searchCustomToken,
  (v) => v.addCustomList,
  (v) => v.searchCustomList,
);
