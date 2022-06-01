import BigNumber from 'bignumber.js';
import {
  Trade,
  useRoutePairsCombinations as originalUseRoutePairsCombinations,
  useTradeWithSlippageTolerance as originalUseTradeWithSlippageTolerance
} from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';

import { MAX_HOPS_COUNT } from '@config/constants';
import { isTezosToken } from '@shared/helpers';
import { Optional, Token } from '@shared/types';

const FALLBACK_TRADE: Trade = [];
const FALLBACK_TOKEN_ID = 0;

const getSwapRouterSdkTokenSlug = (token: Token) =>
  isTezosToken(token) ? 'tez' : `${token.contractAddress}_${token.fa2TokenId ?? FALLBACK_TOKEN_ID}`;

export const useRoutePairsCombinations = (
  inputToken: Optional<Token>,
  outputToken: Optional<Token>,
  routePairs: RoutePair[]
) =>
  originalUseRoutePairsCombinations(
    inputToken ? getSwapRouterSdkTokenSlug(inputToken) : undefined,
    outputToken ? getSwapRouterSdkTokenSlug(outputToken) : undefined,
    routePairs,
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
