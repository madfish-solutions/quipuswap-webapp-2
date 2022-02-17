import { Nullable, RawToken } from '@interfaces/types';

import { getTokenSymbol } from './get-token-appellation';

export const isWhitelisted = (token: RawToken): boolean => {
  return Boolean(token.isWhitelisted);
};

export const getMessageNotWhitelistedToken = (token: RawToken): Nullable<string> => {
  if (!isWhitelisted(token)) {
    const tokenA = getTokenSymbol(token);

    return `Note! The token ${tokenA} is not whitelisted. Ensure it is exactly what you want.`;
  }

  return null;
};

export const getMessageNotWhitelistedTokenPair = (token1: RawToken, token2: RawToken): Nullable<string> => {
  if (!isWhitelisted(token1) && !isWhitelisted(token2)) {
    const symbolA = getTokenSymbol(token1);
    const symbolB = getTokenSymbol(token1);

    return `Note! The token ${symbolA} and ${symbolB} are not whitelisted. Ensure it is exactly what you want.`;
  }

  if (!isWhitelisted(token1) || !isWhitelisted(token2)) {
    const notWhitelisted = isWhitelisted(token1) ? token2 : token1;

    return getMessageNotWhitelistedToken(notWhitelisted);
  }

  return null;
};
