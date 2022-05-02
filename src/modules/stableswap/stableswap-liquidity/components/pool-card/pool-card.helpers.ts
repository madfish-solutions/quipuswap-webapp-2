import { getTokenSymbol } from '@shared/helpers';

import { PreparedTokenData } from './types';

export const extractTokens = (tokensInfo: Array<PreparedTokenData>) => tokensInfo.map(({ token }) => token);

export const preparePoolAmounts = (tokensInfo: Array<PreparedTokenData>) => {
  return tokensInfo.map(({ token, reserves, exchangeRate }) => ({
    amount: reserves,
    dollarEquivalent: reserves.multipliedBy(exchangeRate),
    currency: getTokenSymbol(token)
  }));
};
