import { TezosToolkit } from '@taquito/taquito';

import { TEZOS_TOKEN } from '@app.config';
import { getUserBalance } from '@utils/dapp';
import { fromDecimals } from '@utils/helpers/fromDecimals';
import { Nullable, TokenDataType, WhitelistedToken } from '@utils/types';

const findExchangeRate = (
  token: WhitelistedToken,
  exchangeRates: Array<{ tokenAddress: string; tokenId?: number; exchangeRate: string }>
) =>
  exchangeRates.find(el => {
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

interface TokenChangeType {
  token: WhitelistedToken;
  exchangeRates: Array<{ tokenAddress: string; tokenId?: number; exchangeRate: string }>;
  tezos: Nullable<TezosToolkit>;
  accountPkh: Nullable<string>;
}

export const handleTokenChange = async ({
  token,
  exchangeRates,
  tezos,
  accountPkh
}: TokenChangeType): Promise<Nullable<TokenDataType>> => {
  if (!tezos || !accountPkh || !exchangeRates) {
    return null;
  }

  let finalBalance = '0';

  if (tezos && accountPkh) {
    try {
      const balance = await getUserBalance(tezos, accountPkh, token.contractAddress, token.type, token.fa2TokenId);
      if (balance) {
        finalBalance = fromDecimals(balance, token.metadata.decimals).toString();
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }

  const tokenExchangeRate = findExchangeRate(token, exchangeRates);

  return {
    token: {
      address: token.contractAddress,
      type: token.type,
      id: token.fa2TokenId,
      decimals: token.metadata.decimals
    },
    balance: finalBalance,
    exchangeRate: tokenExchangeRate?.exchangeRate ?? null
  };
};
