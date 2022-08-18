import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LiquidityItem } from '@modules/new-liquidity/interfaces';
import { operationAmountSchema } from '@shared/helpers';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndexRemove } from '../helpers/forms.helpers';
import { Input } from './use-dex-two-remove-liq-form-view-model';

export const useDexTwoRemoveLiqValidation = (
  userBalances: Nullable<BigNumber>[],
  dexTwoItem: LiquidityItem,
  lpTokenBalance: BigNumber,
  lpTokenMetadata: {
    symbol: string;
    decimals: number;
  }
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
      return [getInputSlugByIndexRemove(index), item.required('Amount is required!')];
    });

    const shape: Record<string, NumberAsStringSchema> = Object.fromEntries(shapeMap);

    return yup.object().shape({
      ...shape,
      [Input.LP_INPUT]: operationAmountSchema(
        lpTokenBalance,
        false,
        lpTokenMetadata.decimals,
        t('common|tokenDecimalsOverflowError', {
          tokenSymbol: lpTokenMetadata.symbol,
          decimalPlaces: lpTokenMetadata.decimals
        })
      ).required('Amount is required')
    });
  }, [dexTwoItem.tokensInfo, lpTokenBalance, lpTokenMetadata.decimals, lpTokenMetadata.symbol, t, userBalances]);
};
