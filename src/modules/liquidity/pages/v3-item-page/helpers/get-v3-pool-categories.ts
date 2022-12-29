import BigNumber from 'bignumber.js';

import { LIQUIDITY_V3_POOL_TAGS, TOKENS } from '@config/config';
import { NETWORK_ID } from '@config/environment';
import { Categories } from '@modules/liquidity/interfaces';
import { getTokenSlug, getUniqArray, isExist, isQuipuToken } from '@shared/helpers';
import { mapBackendToken } from '@shared/mapping';
import { Nullable, TokenAddress, Undefined } from '@shared/types';

const FRONTEND_KNOWN_TOKENS = TOKENS.tokens.map(token => ({
  ...mapBackendToken(token),
  categories: token.categories as Undefined<Categories[]>
}));

export const getV3PoolCategories = (
  poolId: Nullable<BigNumber>,
  tokenXAddress: Nullable<TokenAddress>,
  tokenYAddress: Nullable<TokenAddress>
) => {
  const hardcodedCategories = LIQUIDITY_V3_POOL_TAGS[NETWORK_ID][Number(poolId)];

  if (isExist(hardcodedCategories)) {
    return hardcodedCategories;
  }

  const categoriesByTokens = [tokenXAddress, tokenYAddress]
    .map(tokenAddress => {
      if (!isExist(tokenAddress)) {
        return [];
      }

      const knownMatchingToken = FRONTEND_KNOWN_TOKENS.find(
        knownToken => getTokenSlug(knownToken) === getTokenSlug(tokenAddress)
      );

      const categoriesByToken = Array.from(knownMatchingToken?.categories ?? []);
      if (isQuipuToken(tokenAddress)) {
        categoriesByToken.push(Categories.QuipuSwap);
      }

      return categoriesByToken;
    })
    .flat();

  return getUniqArray(categoriesByTokens.concat(Categories.V3), category => category);
};
