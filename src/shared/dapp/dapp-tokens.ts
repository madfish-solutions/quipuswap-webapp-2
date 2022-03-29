import { useState, useCallback, useEffect } from 'react';

import constate from 'constate';
import useSWR from 'swr';

import { NETWORK, NETWORK_ID } from '@config';
import { Standard } from 'types/types';
import { isEmptyArray } from '@shared/helpers/type-checks';
import { Token, TokenWithQSNetworkType } from 'types/types';
import { isValidContractAddress } from '@shared/validators/isValidContractAddress';

import { getTokens, getFallbackTokens, saveCustomToken } from './tokens';
import { getContract } from './get-storage-info';
import { getTokenMetadata } from './tokens-meta-data';
import { useTezos } from '@providers';
import { InvalidFa2TokenIdError, TokenMetadataError } from './dapp-tokens.errors';
import { fa2TokenExists } from './fa2-token-exists';
import { isTokenEqual } from '@shared/helpers/is-token-equal';

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

        const customToken = await getTokenMetadata(NETWORK, address, tokenId);
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
          saveCustomToken(token);
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

      saveCustomToken(token);
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
