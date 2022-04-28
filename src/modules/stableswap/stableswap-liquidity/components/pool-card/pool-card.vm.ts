import { BigNumber } from 'bignumber.js';

import { DEFAULT_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { getTokenSymbol } from '@shared/helpers';
import { ActiveStatus, Token } from '@shared/types';

import { PreparedTokenData } from './types';

export const usePoolCardViewModel = () => {
  const tokens = [
    {
      token: DEFAULT_TOKEN,
      reserves: new BigNumber('1000'),
      exchangeRate: new BigNumber('1000')
    },
    {
      token: TEZOS_TOKEN,
      reserves: new BigNumber('1000'),
      exchangeRate: new BigNumber('1000')
    }
  ];

  const prepareTokens = (tokensInfo: Array<PreparedTokenData>) => tokensInfo.map(({ token }) => token);

  const preparelogos = (tokens_: Array<Token>) =>
    tokens_.map(token => ({ tokenIcon: token.metadata.thumbnailUri, tokenSymbol: getTokenSymbol(token) }));

  const whitelistedTag = {
    status: ActiveStatus.ACTIVE,
    label: 'Whitelisted'
  };

  const prepareValues = (tokensInfo: Array<PreparedTokenData>) => {
    return tokensInfo.map(({ token, reserves, exchangeRate }) => ({
      amount: reserves,
      dollarEquivalent: reserves.multipliedBy(exchangeRate),
      currency: getTokenSymbol(token)
    }));
  };

  return {
    tokens,
    preparelogos,
    prepareValues,
    prepareTokens,
    whitelistedTag,
    selectLink: '',
    transaction: {
      totalValueTranslation: 'Total Value',
      liquidityProvidersFeeTranslation: 'Liquidity providers fee',
      selectTranslation: 'Select',
      valueTranslation: 'Value'
    }
  };
};
