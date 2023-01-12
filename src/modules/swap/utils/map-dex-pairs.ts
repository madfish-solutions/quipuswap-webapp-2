import BigNumber from 'bignumber.js';
import { DexTypeEnum, RouteDirectionEnum, Trade, TradeOperation } from 'swap-router-sdk';

import { FIRST_INDEX, ZERO_AMOUNT } from '@config/constants';
import { isExist } from '@shared/helpers';
import { TokensMap } from '@shared/store/tokens.store';
import { Nullable, Token, Undefined } from '@shared/types';

import { DexPool } from '../types';
import { swapRouterSdkTokenSlugToQuipuTokenSlug } from './swap-router-sdk-adapters';

export const makeDexPair = (
  operation: TradeOperation,
  tokens: Array<Nullable<Token>>,
  tokensAmounts: Array<Undefined<BigNumber>>
) => {
  const { dexType, dexAddress, dexId } = operation;

  const [token1, token2, token3, token4] = tokens;
  const [token1Pool, token2Pool, token3Pool, token4Pool] = tokensAmounts;

  return {
    dexId,
    dexType,
    dexAddress,
    token1: token1!,
    token2: token2!,
    token1Pool: token1Pool!,
    token2Pool: token2Pool!,
    token3: token3 ?? undefined,
    token4: token4 ?? undefined,
    token3Pool,
    token4Pool
  };
};

// eslint-disable-next-line sonarjs/cognitive-complexity
export const mapDexPairs = (trade: Nullable<Trade>, knownTokens: TokensMap) =>
  trade
    ? trade.map((operation: TradeOperation): DexPool => {
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
        const tokens = [aTokenSlug, bTokenSlug, cTokenSlug, dTokenSlug].map((tokenSlug, index) => {
          if (!tokenSlug) {
            return null;
          }

          const token = knownTokens.get(swapRouterSdkTokenSlugToQuipuTokenSlug(tokenSlug, tokensStandards[index]));

          if (!isExist(token)) {
            throw new Error(`No Token Metadata of ${tokenSlug}`);
          }

          return token;
        });
        const [tokenA, tokenB] = tokens.splice(FIRST_INDEX, 2);
        const [tokenAAmount, tokenBAmount] = tokensAmounts.splice(FIRST_INDEX, 2);
        if (dexType === DexTypeEnum.QuipuSwapCurveLike && aTokenIndex! > bTokenIndex!) {
          tokens.splice(bTokenIndex!, ZERO_AMOUNT, tokenB);
          tokens.splice(aTokenIndex!, ZERO_AMOUNT, tokenA);
          tokensAmounts.splice(bTokenIndex!, ZERO_AMOUNT, tokenBAmount);
          tokensAmounts.splice(aTokenIndex!, ZERO_AMOUNT, tokenAAmount);
        } else if (dexType === DexTypeEnum.QuipuSwapCurveLike) {
          tokens.splice(aTokenIndex!, ZERO_AMOUNT, tokenA);
          tokens.splice(bTokenIndex!, ZERO_AMOUNT, tokenB);
          tokensAmounts.splice(aTokenIndex!, ZERO_AMOUNT, tokenAAmount);
          tokensAmounts.splice(bTokenIndex!, ZERO_AMOUNT, tokenBAmount);
        } else if (direction === RouteDirectionEnum.Inverted) {
          tokens.unshift(tokenB, tokenA);
          tokensAmounts.unshift(tokenBAmount, tokenAAmount);
        } else {
          tokens.unshift(tokenA, tokenB);
          tokensAmounts.unshift(tokenAAmount, tokenBAmount);
        }
        // eslint-disable-next-line no-console
        console.log('x3', JSON.stringify([tokens, tokensAmounts], undefined, 2));

        return makeDexPair(operation, tokens, tokensAmounts);
      })
    : [];
