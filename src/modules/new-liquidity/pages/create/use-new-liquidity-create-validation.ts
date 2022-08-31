import { useMemo } from 'react';

import * as yup from 'yup';

import { operationAmountSchema } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from './components/helpers';
import { NewLiqCreateInput } from './new-liquidity-create.interface';

export const useNewLiqudityCreateValidation = (userTokensAndBalances: Array<BalanceToken>, canDelegate: boolean) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const inputAmountSchemas = userTokensAndBalances.map(({ token, balance }) => {
      const tokenMetadata = token.metadata;

      return operationAmountSchema(
        balance ?? null,
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
      [NewLiqCreateInput.BAKER_INPUT]: bakerSchema
    });
  }, [t, canDelegate, userTokensAndBalances]);
};
