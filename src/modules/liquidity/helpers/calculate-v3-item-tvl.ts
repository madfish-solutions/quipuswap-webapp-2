import BigNumber from 'bignumber.js';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { getTokenSlug, isUndefined } from '@shared/helpers';
import { mapTokenAddress } from '@shared/mapping';
import { Undefined, TokensValue } from '@shared/types';

export const calculateV3ItemTvl = (
  tokenX: Undefined<TokensValue>,
  tokenY: Undefined<TokensValue>,
  tokensBalances: Array<BigNumber>,
  exchangeRates: Record<string, BigNumber>
) => {
  if (isUndefined(tokenX) || isUndefined(tokenY)) {
    return ZERO_AMOUNT_BN;
  }

  const addressArray = [mapTokenAddress(tokenX), mapTokenAddress(tokenY)];

  return tokensBalances.reduce((prev, curr, index) => {
    const tokenSlug = getTokenSlug({
      contractAddress: addressArray[index].contractAddress,
      fa2TokenId: addressArray[index].fa2TokenId
    });
    const tokenExchangeRate = exchangeRates[tokenSlug] ?? new BigNumber(1);

    return prev.plus(curr.multipliedBy(tokenExchangeRate));
  }, ZERO_AMOUNT_BN);
};
