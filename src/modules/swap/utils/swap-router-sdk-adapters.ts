import BigNumber from 'bignumber.js';
import {
  TokenStandardEnum,
  Trade,
  getAllowedRoutePairsCombinations as originalGetAllowedRoutePairsCombinations,
  useRoutePairsCombinations as originalUseRoutePairsCombinations,
  useTradeWithSlippageTolerance as originalUseTradeWithSlippageTolerance,
  DexTypeEnum
} from 'swap-router-sdk';
import { RoutePair } from 'swap-router-sdk/dist/interface/route-pair.interface';
import { WhitelistedPair } from 'swap-router-sdk/dist/interface/whitelisted-pair.interface';

import { MAX_HOPS_COUNT } from '@config/constants';
import {
  getTokenIdFromSlug,
  getTokenSlug,
  isExist,
  isGreaterThanZero,
  isLastElementIndex,
  isTezosToken
} from '@shared/helpers';
import { Nullable, Optional, Token } from '@shared/types';

import { useRoutePairs } from '../providers/route-pairs-provider';

const FALLBACK_TRADE: Trade = [];
const FALLBACK_TOKEN_ID = 0;
const MIN_VALID_SWAP_AMOUNT = 1;

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

const getCorrectedTokenAmountWithSlippage = (
  tokenAmountWithSlippage: BigNumber,
  tokenAmountWithoutSlippage: BigNumber
) =>
  isGreaterThanZero(tokenAmountWithoutSlippage) && tokenAmountWithSlippage.isZero()
    ? new BigNumber(MIN_VALID_SWAP_AMOUNT)
    : tokenAmountWithSlippage;

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
  const correctedValue = originalValue.map((operation, index) => {
    const { aTokenAmount: aTokenAmountWithSlippage, bTokenAmount: bTokenAmountWithSlippage, dexType } = operation;
    const { aTokenAmount: aTokenAmountWithoutSlippage, bTokenAmount: bTokenAmountWithoutSlippage } = bestTrade![index];

    return {
      ...operation,
      aTokenAmount: getCorrectedTokenAmountWithSlippage(aTokenAmountWithSlippage, aTokenAmountWithoutSlippage),
      bTokenAmount:
        isLastElementIndex(index, originalValue) && dexType === DexTypeEnum.QuipuSwapV3
          ? bTokenAmountWithSlippage
          : getCorrectedTokenAmountWithSlippage(bTokenAmountWithSlippage, bTokenAmountWithoutSlippage)
    };
  });

  return bestTrade && correctedValue;
};
