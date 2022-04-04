import { Dispatch, SetStateAction } from 'react';

import { TezosToolkit } from '@taquito/taquito';

import { TEZOS_TOKEN } from '@config/tokens';
import { getUserBalance } from '@shared/api/get-user-balance';
import { Nullable, TokenDataMap, Token } from '@shared/types';

import { fromDecimals } from './bignumber';

export enum TokenNumber {
  FIRST = 'first',
  SECOND = 'second'
}

interface TokenChangeType {
  token: Token;
  tokenNumber: TokenNumber;
  exchangeRates: Array<{ tokenAddress: string; tokenId?: number; exchangeRate: string }>;
  tezos: TezosToolkit;
  accountPkh: string;
  setTokensData: Dispatch<SetStateAction<TokenDataMap>>;
}

export const handleTokenChange = async ({
  token,
  tokenNumber,
  exchangeRates,
  tezos,
  accountPkh,
  setTokensData
}: // eslint-disable-next-line sonarjs/cognitive-complexity
TokenChangeType) => {
  let finalBalance: Nullable<string> = null;
  if (tezos && accountPkh) {
    try {
      const balance = await getUserBalance(tezos, accountPkh, token.contractAddress, token.type, token.fa2TokenId);
      if (balance) {
        finalBalance = fromDecimals(balance, token.metadata.decimals).toString();
      }
    } catch (e) {
      // eslint-disable-next-line
      console.error(e);
    }
  }

  setTokensData(prevState => {
    return {
      ...prevState,
      [tokenNumber]: {
        token: {
          address: token.contractAddress,
          type: token.type,
          id: token.fa2TokenId,
          decimals: token.metadata.decimals
        },
        balance: finalBalance,
        exchangeRate: tokenExchangeRate?.exchangeRate ?? null
      }
    };
  });

  if (!exchangeRates || !exchangeRates.find) {
    return;
  }

  const tokenExchangeRate = exchangeRates.find(el => {
    const isTokenTez = token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined;
    if (isTokenTez) {
      return true;
    }
    if (el.tokenAddress === token.contractAddress) {
      if (!token.fa2TokenId) {
        return true;
      }
      if (token.fa2TokenId && el.tokenId === token.fa2TokenId) {
        return true;
      }
    }

    return false;
  });

  setTokensData(prevState => {
    return {
      ...prevState,
      [tokenNumber]: {
        ...prevState[tokenNumber],
        exchangeRate: tokenExchangeRate?.exchangeRate ?? null
      }
    };
  });
};
