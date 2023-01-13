import { DexTypeEnum, RouteDirectionEnum, Trade, TradeOperation } from 'swap-router-sdk';

import { FIRST_INDEX, ZERO_AMOUNT } from '@config/constants';
import { isExist } from '@shared/helpers';
import { TokensMap } from '@shared/store/tokens.store';
import { Nullable } from '@shared/types';

import { DexPool } from '../types';
import { swapRouterSdkTokenSlugToQuipuTokenSlug } from './swap-router-sdk-adapters';

const extractTokensPools = (operation: TradeOperation, knownTokens: TokensMap) => {
  const {
    aTokenSlug,
    bTokenSlug,
    cTokenSlug,
    dTokenSlug,
    dexType,
    aTokenPool,
    bTokenPool,
    cTokenPool,
    dTokenPool,
    aTokenStandard,
    bTokenStandard,
    cTokenStandard,
    dTokenStandard,
    direction
  } = operation;

  let { aTokenIndex, bTokenIndex } = operation;
  if (direction === RouteDirectionEnum.Inverted) {
    const swapBuffer = aTokenIndex;
    aTokenIndex = bTokenIndex;
    bTokenIndex = swapBuffer;
  }

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
  const [tokenAPool, tokenBPool] = tokensPools.splice(FIRST_INDEX, 2);
  if (dexType === DexTypeEnum.QuipuSwapCurveLike && aTokenIndex! > bTokenIndex!) {
    tokensPools.splice(bTokenIndex!, ZERO_AMOUNT, tokenBPool);
    tokensPools.splice(aTokenIndex!, ZERO_AMOUNT, tokenAPool);
  } else if (dexType === DexTypeEnum.QuipuSwapCurveLike) {
    tokensPools.splice(aTokenIndex!, ZERO_AMOUNT, tokenAPool);
    tokensPools.splice(bTokenIndex!, ZERO_AMOUNT, tokenBPool);
  } else if (direction === RouteDirectionEnum.Inverted) {
    tokensPools.unshift(tokenBPool, tokenAPool);
  } else {
    tokensPools.unshift(tokenAPool, tokenBPool);
  }

  return tokensPools;
};

export const mapDexPairs = (trade: Nullable<Trade>, knownTokens: TokensMap) =>
  trade
    ? trade.map((operation: TradeOperation): DexPool => {
        const { dexAddress, dexId, dexType } = operation;

        const tokensPools = extractTokensPools(operation, knownTokens);
        // eslint-disable-next-line no-console
        console.log('x3', JSON.stringify(tokensPools, undefined, 2));

        return {
          dexId,
          dexType,
          dexAddress,
          tokensPools
        };
      })
    : [];
