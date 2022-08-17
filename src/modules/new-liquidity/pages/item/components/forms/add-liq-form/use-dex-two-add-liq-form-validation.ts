import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LiquidityItemDto } from '@modules/new-liquidity/dto';
import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../helpers/forms.helpers';
import { Input } from './use-dex-two-add-liq-form.vm';
// TODO: check if this really LiquidityItemDto (not LiquidityItem)
export const useDexTwoAddLiqValidation = (userBalances: Nullable<BigNumber>[], dexTwoItem: LiquidityItemDto) => {
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

    shape[Input.BAKER_INPUT] = yup.string().required('Amount is required');

    return yup.object().shape(shape);
  }, [dexTwoItem.tokensInfo, t, userBalances]);
};
