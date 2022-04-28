import { useMemo } from 'react';

import { getTokenSymbol } from '@shared/helpers';
import { ActiveStatus, Token } from '@shared/types';
import { useTranslation } from '@translation';

import { PreparedTokenData } from './types';

const prepareTokens = (tokensInfo: Array<PreparedTokenData>) => tokensInfo.map(({ token }) => token);

const preparelogos = (tokens_: Array<Token>) =>
  tokens_.map(token => ({ tokenIcon: token.metadata.thumbnailUri, tokenSymbol: getTokenSymbol(token) }));

const prepareValues = (tokensInfo: Array<PreparedTokenData>) => {
  return tokensInfo.map(({ token, reserves, exchangeRate }) => ({
    amount: reserves,
    dollarEquivalent: reserves.multipliedBy(exchangeRate),
    currency: getTokenSymbol(token)
  }));
};

export const usePoolCardViewModel = () => {
  const { t } = useTranslation();

  const whitelistedTag = useMemo(
    () => ({
      status: ActiveStatus.ACTIVE,
      label: t('stableSwap|whiteListed')
    }),
    [t]
  );

  return {
    preparelogos,
    prepareValues,
    prepareTokens,
    whitelistedTag,
    transaction: {
      totalValueTranslation: t('stableSwap|totalValue'),
      liquidityProvidersFeeTranslation: t('stableSwap|liquidityProvidersFee'),
      selectTranslation: t('stableSwap|select'),
      valueTranslation: t('stableSwap|value')
    }
  };
};
