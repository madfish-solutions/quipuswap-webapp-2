import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

export const useV3AddLiqFormValidation = (userBalances: Nullable<BigNumber>[], tokens: Array<Nullable<Token>>) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const inputAmountSchemas = userBalances.map((balance, index) => {
      const tokenMetadata = tokens[index]?.metadata;

      return operationAmountSchema(
        balance,
        false,
        tokenMetadata?.decimals,
        tokenMetadata &&
          t('common|tokenDecimalsOverflowError', {
            tokenSymbol: tokenMetadata.symbol,
            decimalPlaces: tokenMetadata.decimals
          })
      );
    });

    const shapeMap: Array<[string, NumberAsStringSchema]> = inputAmountSchemas.map((item, index) => {
      return [`tokenInput-${index}`, item.required('Amount is required!')];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape({
      ...shape
    });
  }, [t, tokens, userBalances]);
};
