import { useMemo } from 'react';

import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LiquidityItem } from '@modules/new-liquidity/interfaces';
import { operationAmountSchema } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { Token } from '@shared/types';
import { NumberAsStringSchema } from '@shared/validators';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from '../helpers';
import { Input } from '../interface';

export const useDexTwoRemoveLiqValidation = (
  userBalances: Nullable<BigNumber>[],
  dexTwoItem: LiquidityItem,
  lpToken: Token
) => {
  const { t } = useTranslation();
  const lpTokenBalance = useTokenBalance(lpToken) ?? null;
  const { symbol, decimals } = lpToken.metadata;

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

    return yup.object().shape({
      ...shape,
      [Input.THIRD_INPUT]: operationAmountSchema(
        lpTokenBalance,
        false,
        decimals,
        t('common|tokenDecimalsOverflowError', {
          tokenSymbol: symbol,
          decimalPlaces: decimals
        })
      ).required('Amount is required')
    });
  }, [decimals, dexTwoItem.tokensInfo, lpTokenBalance, symbol, t, userBalances]);
};
