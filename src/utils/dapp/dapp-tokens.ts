import { useState, useCallback, useEffect } from 'react';

import constate from 'constate';
import useSWR from 'swr';

import { NETWORK, NETWORK_ID } from '@app.config';
import { Standard } from '@graphql';
import { isEmptyArray, isTokenEqual } from '@utils/helpers';
import { WhitelistedToken, WhitelistedTokenWithQSNetworkType } from '@utils/types';
import { isValidContractAddress } from '@utils/validators';

import { getTokens, getFallbackTokens, getContract, getTokenMetadata, saveCustomToken } from '.';
import { useTezos } from './dapp';

export interface DAppTokens {
  tokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
  searchTokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
}

const useDappTokens = () => {
  const [{ tokens, searchTokens }, setState] = useState<DAppTokens>({
    tokens: { loading: true, data: [] },
    searchTokens: { loading: false, data: [] }
  });

  const tezos = useTezos();

  const getTokensData = useCallback(async () => getTokens(NETWORK, true), []);
  const { data: tokensData, error: tokensError } = useSWR(['tokens-initial-data', NETWORK], getTokensData);

  useEffect(() => {
    setState(prevState => {
      const prevTokens = prevState.tokens.data;
      const fallbackTokens = isEmptyArray(prevTokens) ? getFallbackTokens(NETWORK, true) : prevTokens;

      return {
        ...prevState,
        tokens: { loading: !tokensData && !tokensError, data: tokensData ?? fallbackTokens }
      };
    });
  }, [tokensData, tokensError]);

  const searchCustomToken = useCallback(
    async (address: string, tokenId?: number, saveAfterSearch?: boolean): Promise<WhitelistedToken | null> => {
      if (isValidContractAddress(address)) {
        setState(prevState => ({
          ...prevState,
          searchTokens: { loading: true, data: [] }
        }));
        let type;
        try {
          type = await getContract(tezos!, address);
        } catch (e) {
          type = null;
        }
        if (!type) {
          setState(prevState => ({
            ...prevState,
            searchTokens: { loading: false, data: [] }
          }));

          return null;
        }
        const isFa2 = Boolean(type.methods.update_operators);
        const customToken = await getTokenMetadata(NETWORK, address, tokenId);
        if (!customToken) {
          setState(prevState => ({
            ...prevState,
            searchTokens: { loading: false, data: [] }
          }));

          return null;
        }
        const token: WhitelistedTokenWithQSNetworkType = {
          contractAddress: address,
          metadata: customToken,
          type: isFa2 ? Standard.Fa2 : Standard.Fa12,
          fa2TokenId: isFa2 ? tokenId || 0 : undefined,
          network: NETWORK_ID
        };
        setState(prevState => ({
          ...prevState,
          searchTokens: { loading: false, data: [token] }
        }));
        if (saveAfterSearch) {
          saveCustomToken(token);
        }

        return token;
      }

      return null;
    },
    [tezos]
  );

  const addCustomToken = useCallback(
    (token: WhitelistedTokenWithQSNetworkType) => {
      saveCustomToken(token);
      setState(prevState => ({
        ...prevState,
        tokens: {
          ...tokens,
          data: [...tokens.data.filter(alreadyPresentToken => !isTokenEqual(alreadyPresentToken, token)), token]
        },
        searchTokens: { loading: false, data: [] }
      }));
    },
    [tokens]
  );

  return {
    tokens,
    searchTokens,
    addCustomToken,
    searchCustomToken
  };
};

export const [DAppTokensProvider, useTokens, useSearchTokens, useAddCustomToken, useSearchCustomTokens] = constate(
  useDappTokens,
  v => v.tokens,
  v => v.searchTokens,
  v => v.addCustomToken,
  v => v.searchCustomToken
);
