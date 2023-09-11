import { useMemo } from 'react';

import { CreatePositionFormik } from '@modules/liquidity/types';
import { TokenInputProps } from '@shared/components';
import { getFormikError, getTokenDecimals, isExist, multipliedIfPossible } from '@shared/helpers';
import { BalanceToken } from '@shared/hooks';
import { Nullable } from '@shared/types';
import { useTranslation } from '@translation';

import { usePositionTicks } from './use-position-ticks';
import { getCreatePositionAmountInputSlugByIndex, shouldAddTokenX, shouldAddTokenY, Tick } from '../../helpers';
import {
  CreatePositionInput,
  CreatePositionAmountInput,
  CreatePositionPriceInput
} from '../../types/create-position-form';
import { useLiquidityV3ItemTokensExchangeRates } from '../use-liquidity-v3-item-tokens-exchange-rates';

export const useAmountInputsProps = (
  tokensWithBalances: BalanceToken[],
  handleInputChange: (
    inputSlug: CreatePositionAmountInput | CreatePositionPriceInput,
    inputDecimals: number
  ) => (value: string) => void,
  currentTick: Nullable<Tick>,
  formik: CreatePositionFormik
) => {
  const { tokenXExchangeRate, tokenYExchangeRate } = useLiquidityV3ItemTokensExchangeRates();
  const { t } = useTranslation();
  const { upperTick, lowerTick } = usePositionTicks(formik);

  return useMemo<TokenInputProps[]>(() => {
    const exchangeRates = [tokenXExchangeRate, tokenYExchangeRate];

    return tokensWithBalances.map(({ balance, token }, index) => {
      const inputSlug = getCreatePositionAmountInputSlugByIndex(index);
      const decimals = getTokenDecimals(token);
      const dollarEquivalent = multipliedIfPossible(formik.values[inputSlug], exchangeRates[index]);
      const canCalculateAmount = isExist(currentTick) && isExist(upperTick) && isExist(lowerTick);
      const readOnly =
        inputSlug === CreatePositionInput.FIRST_AMOUNT_INPUT
          ? canCalculateAmount && !shouldAddTokenX(currentTick.index, upperTick.index)
          : canCalculateAmount && !shouldAddTokenY(currentTick.index, lowerTick.index);

      return {
        value: formik.values[inputSlug],
        balance,
        readOnly,
        label: t('common|Input'),
        error: readOnly ? undefined : getFormikError(formik, inputSlug),
        decimals,
        dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent,
        tokens: token,
        hiddenNotWhitelistedMessage: true,
        hiddenUnderline: true,
        onInputChange: handleInputChange(inputSlug, decimals)
      };
    });
  }, [
    tokenXExchangeRate,
    tokenYExchangeRate,
    tokensWithBalances,
    formik,
    currentTick,
    upperTick,
    lowerTick,
    t,
    handleInputChange
  ]);
};
