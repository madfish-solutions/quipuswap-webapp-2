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
import { InvalidFa2TokenIdError, TokenMetadataError } from './dapp-tokens.errors';
import { fa2TokenExists } from './fa2-token-exists';

export interface DAppTokens {
  tokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
  searchTokens: { data: WhitelistedToken[]; loading: boolean; error?: string };
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
    async (address: string, tokenId?: number, saveAfterSearch?: boolean): Promise<WhitelistedToken | null> => {
      if (!isValidContractAddress(address)) {
        return null;
      }

      setState(prevState => ({
        ...prevState,
        searchTokens: { loading: true, data: [] }
      }));
      try {
        const tokenContract = await getContract(tezos!, address);

        const isFa2 = Boolean(tokenContract.methods.update_operators);
        if (isFa2 && !(await fa2TokenExists(tezos!, address, tokenId ?? DEFAULT_FA2_TOKEN_ID))) {
          throw new InvalidFa2TokenIdError(address, tokenId ?? DEFAULT_FA2_TOKEN_ID);
        }

        const customToken = await getTokenMetadata(NETWORK, address, tokenId);
        if (!customToken) {
          throw new TokenMetadataError();
        }

        const token: WhitelistedTokenWithQSNetworkType = {
          contractAddress: address,
          metadata: customToken,
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
