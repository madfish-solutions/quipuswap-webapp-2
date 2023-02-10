import { Trade, TradeOperation } from 'swap-router-sdk';

import { SECOND_TUPLE_INDEX, SINGLE_TOKEN_VALUE } from '@config/constants';
import { isExist } from '@shared/helpers';
import { TokensMap } from '@shared/store/tokens.store';
import { Nullable } from '@shared/types';

import { DexPool } from '../types';
import { swapRouterSdkTokenSlugToQuipuTokenSlug } from './swap-router-sdk-adapters';

export const extractTokensPools = (operation: TradeOperation, knownTokens: TokensMap) => {
  const {
    aTokenSlug,
    bTokenSlug,
    cTokenSlug,
    dTokenSlug,
    aTokenPool,
    bTokenPool,
    cTokenPool,
    dTokenPool,
    aTokenStandard,
    bTokenStandard,
    cTokenStandard,
    dTokenStandard
  } = operation;

  const tokensAmounts = [aTokenPool, bTokenPool, cTokenPool, dTokenPool];
  const tokensStandards = [aTokenStandard, bTokenStandard, cTokenStandard, dTokenStandard];
  const tokensPools = [aTokenSlug, bTokenSlug, cTokenSlug, dTokenSlug]
    .map((tokenSlug, index) => {
      if (!tokenSlug) {
        return null;
      }

      const token = knownTokens.get(swapRouterSdkTokenSlugToQuipuTokenSlug(tokenSlug, tokensStandards[index]));

      if (!isExist(token)) {
        throw new Error(`No Token Metadata of ${tokenSlug}`);
      }

      return { token, pool: tokensAmounts[index]! };
    })
    .filter(isExist);
  const [tokenBPool] = tokensPools.splice(SECOND_TUPLE_INDEX, SINGLE_TOKEN_VALUE);
  tokensPools.push(tokenBPool);

  return tokensPools;
};

export const mapDexPairs = (trade: Nullable<Trade>, knownTokens: TokensMap) =>
  trade
    ? trade.map((operation: TradeOperation): DexPool => {
        const { dexAddress, dexId, dexType } = operation;

        const tokensPools = extractTokensPools(operation, knownTokens);

        return {
          dexId,
          dexType,
          dexAddress,
          tokensPools
        };
      })
    : [];
