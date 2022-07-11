import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LP_INPUT_KEY, STABLESWAP_LP_DECIMALS } from '@config/constants';
import { StableswapItem } from '@modules/stableswap/types';
import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../../../../../../helpers';

export const useRemoveLiqFormValidation = (
  userLpBalance: Nullable<BigNumber>,
  userTokenBalance: Array<BigNumber>,
  stableswapItem: Nullable<StableswapItem>,
  isBalancedProportion: boolean
) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const isZeroInclusive = !isBalancedProportion;
    const inputAmountSchemas: Array<NumberAsStringSchema> = userTokenBalance.map((balance, index) => {
      const tokenMetadata = stableswapItem?.tokensInfo[index]?.token.metadata;

      return operationAmountSchema(
        balance,
        isZeroInclusive,
        tokenMetadata?.decimals,
        tokenMetadata &&
          t('common|tokenDecimalsOverflowError', {
            tokenSymbol: tokenMetadata.symbol,
            decimalPlaces: tokenMetadata.decimals
          })
      );
    });
    const lpInputSchema = operationAmountSchema(
      userLpBalance,
      undefined,
      STABLESWAP_LP_DECIMALS,
      t('common|tokenDecimalsOverflowError', { tokenSymbol: 'Stableswap LP', decimalPlaces: STABLESWAP_LP_DECIMALS })
    );

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((item, index) => {
      const schema = isBalancedProportion ? item.required(t('common|Value is required')) : item;

      return [getInputSlugByIndex(index), schema];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape({
      [LP_INPUT_KEY]: lpInputSchema.required(
        isBalancedProportion ? t('common|Value is required') : t('common|At least one output amount should be provided')
      ),
      ...shape
    });
  }, [isBalancedProportion, t, userLpBalance, userTokenBalance, stableswapItem]);
};
