import React from 'react';
import {TezosToolkit} from '@taquito/taquito';

import {TEZOS_TOKEN} from '@utils/defaults';
import {TokenDataMap, WhitelistedToken} from '@utils/types';

import {getBalance} from './getBalance';

type TokenChangeType = {
  token: WhitelistedToken;
  tokenNumber: 'first' | 'second';
  exchangeRates: any;
  tezos: TezosToolkit;
  accountPkh?: string | null;
  setTokensData: React.Dispatch<React.SetStateAction<TokenDataMap>>;
};

export const handleTokenChange = async ({
  token,
  tokenNumber,
  exchangeRates,
  tezos,
  accountPkh,
  setTokensData,
}: TokenChangeType & {nonce?: number}) => {
  if (!exchangeRates || !exchangeRates.find) return;
  const finalBalance = await getBalance({
    tezos,
    accountPkh,
    token,
    tokenNumber,
  });
  const tokenExchangeRate = exchangeRates.find(
    (el: {tokenAddress: string; tokenId?: number; exchangeRate: string}) => {
      const isTokenTez =
        token.contractAddress === TEZOS_TOKEN.contractAddress && el.tokenAddress === undefined;
      if (isTokenTez) return true;
      if (el.tokenAddress === token.contractAddress) {
        if (!token.fa2TokenId) return true;
        if (token.fa2TokenId && el.tokenId === token.fa2TokenId) return true;
      }
      return false;
    },
  );

  setTokensData((prevState) => ({
    ...prevState,
    [tokenNumber]: {
      token: {
        address: token.contractAddress,
        type: token.type,
        id: token.fa2TokenId,
        decimals: token.metadata.decimals,
      },
      balance: finalBalance,
      exchangeRate: tokenExchangeRate?.exchangeRate ?? null,
    },
  }));
};
