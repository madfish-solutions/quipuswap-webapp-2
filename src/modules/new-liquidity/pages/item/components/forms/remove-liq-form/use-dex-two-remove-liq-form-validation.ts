import BigNumber from 'bignumber.js';
import * as yup from 'yup';

import { LiquidityItem } from '@modules/new-liquidity/interfaces';
import { operationAmountSchema } from '@shared/helpers';
import { useTranslation } from '@translation';

import { Input } from './dex-two-remove-liq-form.interface';

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

  return yup.object().shape({
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
};
