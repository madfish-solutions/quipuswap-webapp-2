import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { Optional, Token } from '@shared/types';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from './components/helpers';
import { LiquidityCreateInput } from './liquidity-create.interface';

export const useLiquidityCreateValidation = (
  tokens: Array<Optional<Token>>,
  userBalances: Array<Nullable<BigNumber>>,
  canDelegate: boolean
) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const inputAmountSchemas = tokens.map((token, index) => {
      const tokenMetadata = token?.metadata;

      return operationAmountSchema(
        userBalances[index] ?? null,
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
      return [getInputSlugByIndex(index), item.required('Amount is required!')];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    const bakerSchema = canDelegate ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      ...shape,
      [LiquidityCreateInput.BAKER_INPUT]: bakerSchema
    });
  }, [tokens, canDelegate, userBalances, t]);
};
