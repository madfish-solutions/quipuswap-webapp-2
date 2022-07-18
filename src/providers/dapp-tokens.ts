import { useState, useCallback, useEffect } from 'react';

import constate from 'constate';
import useSWR from 'swr';

import { NETWORK } from '@config/config';
import { NETWORK_ID } from '@config/enviroment';
import { getTokenMetadata, saveCustomTokenApi } from '@shared/api';
import { getContract } from '@shared/dapp';
import { InvalidFa2TokenIdError, TokenMetadataError } from '@shared/errors';
import { fa2TokenExists, getFallbackTokens, getTokens, isEmptyArray, isTokenEqual } from '@shared/helpers';
import { Standard, Token, TokenWithQSNetworkType } from '@shared/types';
import { isValidContractAddress } from '@shared/validators';

import { useTezos } from './use-dapp';

export interface DAppTokens {
  tokens: { data: Token[]; loading: boolean; error?: string };
  searchTokens: { data: Token[]; loading: boolean; error?: string };
}

const DEFAULT_FA2_TOKEN_ID = 0;

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
    async (address: string, tokenId?: number, saveAfterSearch?: boolean): Promise<Token | null> => {
      if (!isValidContractAddress(address)) {
        return null;
      }

      setState(prevState => ({
        ...prevState,
        searchTokens: { loading: true, data: [] }
      }));
      try {
        if (!tezos) {
          throw new Error('Tezos is undefined');
        }
        const tokenContract = await getContract(tezos, address);

        const isFa2 = Boolean(tokenContract.methods.update_operators);
        if (isFa2 && !(await fa2TokenExists(tezos, address, tokenId ?? DEFAULT_FA2_TOKEN_ID))) {
          throw new InvalidFa2TokenIdError(address, tokenId ?? DEFAULT_FA2_TOKEN_ID);
        }

        const customToken = await getTokenMetadata({
          contractAddress: address,
          fa2TokenId: tokenId
        });
        if (!customToken) {
          throw new TokenMetadataError();
        }

        const token: TokenWithQSNetworkType = {
          contractAddress: address,
          metadata: customToken,
          isWhitelisted: false,
          type: isFa2 ? Standard.Fa2 : Standard.Fa12,
          fa2TokenId: isFa2 ? tokenId || DEFAULT_FA2_TOKEN_ID : undefined,
          network: NETWORK_ID
        };
        setState(prevState => ({
          ...prevState,
          searchTokens: { loading: false, data: [token] }
        }));
        if (saveAfterSearch) {
          saveCustomTokenApi(token);
        }

        return token;
      } catch {
        setState(prevState => ({
          ...prevState,
          searchTokens: { loading: false, data: [] }
        }));

        return null;
      }
    },
    [tezos]
  );

  const addCustomToken = useCallback(
    (token: TokenWithQSNetworkType) => {
      const isTokenInList = tokens.data.some(token_ => isTokenEqual(token_, token));
      if (isTokenInList) {
        return;
      }

      saveCustomTokenApi(token);
      setState(prevState => ({
        ...prevState,
        tokens: {
          ...tokens,
          data: [...tokens.data, token]
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
