import BigNumber from 'bignumber.js';
import {
  TokenStandardEnum,
  Trade,
  getAllowedRoutePairsCombinations as originalGetAllowedRoutePairsCombinations,
  useRoutePairsCombinations as originalUseRoutePairsCombinations,
  useTradeWithSlippageTolerance as originalUseTradeWithSlippageTolerance
} from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import { MAX_HOPS_COUNT } from '@config/constants';
import { WHITELISTED_POOLS } from '@config/whitelisted-pools';
import { getTokenIdFromSlug, getTokenSlug, isExist, isTezosToken } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

const FALLBACK_TRADE: Trade = [];
const FALLBACK_TOKEN_ID = 0;

export const getSwapRouterSdkTokenSlug = (token: Token) =>
  getTokenSlug({
    ...token,
    fa2TokenId: isTezosToken(token) ? undefined : token.fa2TokenId ?? FALLBACK_TOKEN_ID
  });

export const swapRouterSdkTokenSlugToQuipuTokenSlug = (inputSlug: string, tokenStandard?: TokenStandardEnum) => {
  const { contractAddress, fa2TokenId } = getTokenIdFromSlug(inputSlug);

  if (isExist(fa2TokenId)) {
    return getTokenSlug({
      contractAddress,
      fa2TokenId: tokenStandard === TokenStandardEnum.FA2 ? fa2TokenId : undefined
    });
  }

  return inputSlug;
};

export const useRoutePairsCombinations = (
  inputToken: Optional<Token>,
  outputToken: Optional<Token>,
  routePairs: RoutePair[]
) =>
  originalUseRoutePairsCombinations(
    inputToken ? getSwapRouterSdkTokenSlug(inputToken) : undefined,
    outputToken ? getSwapRouterSdkTokenSlug(outputToken) : undefined,
    routePairs,
    WHITELISTED_POOLS,
    MAX_HOPS_COUNT
  );

export const getAllowedRoutePairsCombinations = (inputToken: Token, outputToken: Token, routePairs: RoutePair[]) =>
  originalGetAllowedRoutePairsCombinations(
    inputToken ? getSwapRouterSdkTokenSlug(inputToken) : undefined,
    outputToken ? getSwapRouterSdkTokenSlug(outputToken) : undefined,
    routePairs,
    WHITELISTED_POOLS,
    MAX_HOPS_COUNT
  );

export const useTradeWithSlippageTolerance = (
  inputAmount: Nullable<BigNumber>,
  bestTrade: Nullable<Trade>,
  tradingSlippage: BigNumber
) => {
  const originalValue = originalUseTradeWithSlippageTolerance(
    inputAmount ?? undefined,
    bestTrade ?? FALLBACK_TRADE,
    tradingSlippage.toNumber()
  );

  return bestTrade && originalValue;
};
