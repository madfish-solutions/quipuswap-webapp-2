import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LiquidityItem } from '@modules/new-liquidity/interfaces';
import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../helpers/forms.helpers';
import { Input } from '../interface';

export const useDexTwoAddLiqValidation = (
  userBalances: Nullable<BigNumber>[],
  dexTwoItem: LiquidityItem,
  shouldShowBakerInput: boolean
) => {
  const { t } = useTranslation();

  return useMemo(() => {
    const inputAmountSchemas = userBalances.map((balance, index) => {
      const tokenMetadata = dexTwoItem.tokensInfo[index].token.metadata;

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
      return [getInputSlugByIndex(index), item.required('Amount is required!')];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    const bakerSchema = shouldShowBakerInput ? yup.string().required('Baker is required') : yup.string();

    return yup.object().shape({
      ...shape,
      [Input.THIRD_INPUT]: bakerSchema
    });
  }, [dexTwoItem.tokensInfo, shouldShowBakerInput, t, userBalances]);
};
