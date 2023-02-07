import BigNumber from 'bignumber.js';
import {
  TokenStandardEnum,
  Trade,
  getAllowedRoutePairsCombinations as originalGetAllowedRoutePairsCombinations,
  useRoutePairsCombinations as originalUseRoutePairsCombinations,
  useTradeWithSlippageTolerance as originalUseTradeWithSlippageTolerance
} from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';
import { WhitelistedPair } from 'swap-router-sdk/dist/interface/whitelisted-pair.interface';

import { MAX_HOPS_COUNT } from '@config/constants';
import { getTokenIdFromSlug, getTokenSlug, isExist, isTezosToken } from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';

import { useRoutePairs } from '../providers/route-pairs-provider';

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
) => {
  const { whitelistedPairs } = useRoutePairs();

  return originalUseRoutePairsCombinations(
    inputToken ? getSwapRouterSdkTokenSlug(inputToken) : undefined,
    outputToken ? getSwapRouterSdkTokenSlug(outputToken) : undefined,
    routePairs,
    whitelistedPairs,
    MAX_HOPS_COUNT
  );
};

export const getAllowedRoutePairsCombinations = (
  inputToken: Token,
  outputToken: Token,
  routePairs: RoutePair[],
  whitelistedPairs: WhitelistedPair[]
) =>
  originalGetAllowedRoutePairsCombinations(
    inputToken ? getSwapRouterSdkTokenSlug(inputToken) : undefined,
    outputToken ? getSwapRouterSdkTokenSlug(outputToken) : undefined,
    routePairs,
    whitelistedPairs,
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
