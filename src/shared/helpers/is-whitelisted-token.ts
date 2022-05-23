import { SLASH } from '@config/constants';
import { Nullable, Optional, Token } from '@shared/types';

import { getFirstElement, isEmptyArray, isSingleElement, toArray } from './arrays';
import { getSymbolsString, getTokenSymbol } from './get-token-appellation';
import { isExist } from './type-checks';

type Tokens = Optional<Token> | Array<Optional<Token>>;

export const isWhitelisted = (token: Token): boolean => {
  return Boolean(token.isWhitelisted);
};

export const getMessageNotWhitelistedToken = (token: Token): Nullable<string> => {
  if (!isWhitelisted(token)) {
    const tokenA = getTokenSymbol(token);

    return `Note! The token ${tokenA} is not whitelisted. Ensure it is exactly what you want.`;
  }

  return null;
};

export const getMessageNotWhitelistedTokenPair = (_tokens: Tokens): Nullable<string> => {
  const tokens = toArray(_tokens).filter(isExist);
  const notWhitelistedTokens = tokens.filter(token => !isWhitelisted(token));

  if (!isEmptyArray(notWhitelistedTokens)) {
    return null;
  } else if (isSingleElement(notWhitelistedTokens)) {
    return getMessageNotWhitelistedToken(getFirstElement(notWhitelistedTokens));
  } else {
    const tokensSymbolsList = getSymbolsString(notWhitelistedTokens).replaceAll(SLASH, 'and');

    return `Note! The tokens ${tokensSymbolsList} are not whitelisted. Ensure it is exactly what you want.`;
  }
};
