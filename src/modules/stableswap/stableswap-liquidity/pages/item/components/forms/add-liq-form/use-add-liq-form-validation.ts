import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { StableswapItem } from '@modules/stableswap/types';
import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../../../../../../helpers';

export const useAddLiqFormValidation = (
  userBalance: Array<Nullable<BigNumber>>,
  stableswapItem: Nullable<StableswapItem>,
  isBalancedProportion: boolean
) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const isZeroInclusive = !isBalancedProportion;
    const inputAmountSchemas: Array<NumberAsStringSchema> = userBalance.map((balance, index) => {
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

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((item, index) => {
      const fixedItem = isBalancedProportion ? item.required('Value is required') : item;

      return [getInputSlugByIndex(index), fixedItem];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape(shape);
  }, [isBalancedProportion, userBalance, stableswapItem, t]);
};
