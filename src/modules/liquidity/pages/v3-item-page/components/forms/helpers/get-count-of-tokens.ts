import BigNumber from 'bignumber.js';

import { FIRST_INDEX } from '@config/constants';
import { isNull, isUndefined } from '@shared/helpers';
import { Nullable, Token, Undefined } from '@shared/types';

const LAST_TOKEN_INDEX = 1;

export const getCountOfTokens = (
  currentPrice: Nullable<BigNumber>,
  minPrice: Undefined<BigNumber>,
  maxPrice: Undefined<BigNumber>,
  tokens: Array<Nullable<Token>>
) => {
  if (isNull(currentPrice) || tokens.some(token => isNull(token)) || isUndefined(minPrice) || isUndefined(maxPrice)) {
    return [];
  }

  if (currentPrice.isLessThan(minPrice)) {
    return tokens.slice(FIRST_INDEX, LAST_TOKEN_INDEX);
  }

  if (currentPrice.isGreaterThan(maxPrice)) {
    return tokens.slice(LAST_TOKEN_INDEX);
  }

  return tokens;
};
