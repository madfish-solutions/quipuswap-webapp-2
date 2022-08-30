import { useMemo } from 'react';

import * as yup from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { BalanceToken } from '@shared/types';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../../../../../../helpers';

export const useAddLiqFormValidation = (userBalance: Array<BalanceToken>, isBalancedProportion: boolean) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const isZeroInclusive = !isBalancedProportion;
    const inputAmountSchemas: Array<NumberAsStringSchema> = userBalance.map(({ token, balance }) => {
      const tokenMetadata = token.metadata;

      return operationAmountSchema(
        balance ?? null,
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
  }, [isBalancedProportion, userBalance, t]);
};
