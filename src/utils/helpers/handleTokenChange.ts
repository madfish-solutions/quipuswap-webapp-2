import React from 'react';

import { TezosToolkit } from '@taquito/taquito';

import { getUserBalance } from '@utils/dapp';
import { TEZOS_TOKEN } from '@utils/defaults';
import { TokenDataMap, WhitelistedToken } from '@utils/types';

import { fromDecimals } from './fromDecimals';

type TokenChangeType = {
  token: WhitelistedToken;
  tokenNumber: 'first' | 'second';
  exchangeRates: Array<{ tokenAddress: string; tokenId?: number; exchangeRate: string }>;
  tezos: TezosToolkit;
  accountPkh: string;
  setTokensData: React.Dispatch<React.SetStateAction<TokenDataMap>>;
};

export const handleTokenChange = async ({
  token,
  tokenNumber,
  exchangeRates,
  tezos,
  accountPkh,
  setTokensData
}: // eslint-disable-next-line sonarjs/cognitive-complexity
TokenChangeType) => {
  if (!exchangeRates || !exchangeRates.find) return;
  let finalBalance = '0';
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

  const tokenExchangeRate = exchangeRates.find(el => {
    const isTokenTez = token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined;
    if (isTokenTez) return true;
    if (el.tokenAddress === token.contractAddress) {
      if (!token.fa2TokenId) return true;
      if (token.fa2TokenId && el.tokenId === token.fa2TokenId) return true;
    }

    return false;
  });

  setTokensData(prevState => ({
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
  }));
};
