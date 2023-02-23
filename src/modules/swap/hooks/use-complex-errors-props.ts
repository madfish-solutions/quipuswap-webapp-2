import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import { Trade } from 'swap-router-sdk';

import { DATA_TEST_ID_PROP_NAME, MAX_HOPS_COUNT, PRICE_IMPACT_WARNING_THRESHOLD } from '@config/constants';
import { ComplexErrorProps } from '@shared/components';
import { canUseThreeRouteApi, FormatNumber, isEmptyArray, isExist } from '@shared/helpers';
import { Nullable, Optional } from '@shared/types';
import { useTranslation } from '@translation';

import { ThreeRouteSwapResponse } from '../types';
import { SwapFormValues } from '../utils/types';

export const useComplexErrorsProps = (
  formValues: Partial<SwapFormValues>,
  threeRouteSwap: Nullable<ThreeRouteSwapResponse>,
  noMediatorsTradeWithSlippage: Nullable<Trade>,
  isLoading: boolean,
  priceImpact: Optional<BigNumber>,
  atLeastOneRouteWithV3: boolean,
  poolsForTokensArePresent: boolean
) => {
  const { t } = useTranslation();
  const { inputToken, outputToken, inputAmount, outputAmount } = formValues;
  const noRouteFound =
    isEmptyArray(threeRouteSwap?.chains ?? null) &&
    !isLoading &&
    isEmptyArray(noMediatorsTradeWithSlippage) &&
    isExist(inputToken) &&
    isExist(outputToken) &&
    (isExist(inputAmount) || isExist(outputAmount));

  return useMemo(() => {
    const result: ComplexErrorProps[] = [];

    if (noRouteFound && !poolsForTokensArePresent) {
      result.push({
        error: t('swap|failedToFindNotEmptyPoolsForTokens'),
        [DATA_TEST_ID_PROP_NAME]: 'failedToFindNotEmptyPoolsForTokens'
      });
    } else if (noRouteFound && canUseThreeRouteApi()) {
      result.push({
        error: t('swap|tryChangingAmount'),
        [DATA_TEST_ID_PROP_NAME]: 'tryChangingAmount'
      });
    } else if (noRouteFound) {
      result.push(
        atLeastOneRouteWithV3
          ? {
              error: t('swap|inputAmountIsTooBig'),
              [DATA_TEST_ID_PROP_NAME]: 'inputAmountIsTooBig'
            }
          : {
              error: t('swap|noRouteFoundError', { maxHopsCount: MAX_HOPS_COUNT }),
              [DATA_TEST_ID_PROP_NAME]: 'noRouteFound'
            }
      );
    }

    if (priceImpact?.gt(PRICE_IMPACT_WARNING_THRESHOLD)) {
      result.push({
        error: t('swap|priceImpactWarning', {
          priceImpact: FormatNumber(priceImpact ?? PRICE_IMPACT_WARNING_THRESHOLD)
        }),
        [DATA_TEST_ID_PROP_NAME]: 'shouldShowPriceImpactWarning'
      });
    }

    return result;
  }, [atLeastOneRouteWithV3, noRouteFound, poolsForTokensArePresent, priceImpact, t]);
};
