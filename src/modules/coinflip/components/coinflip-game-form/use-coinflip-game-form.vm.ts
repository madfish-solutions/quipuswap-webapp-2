import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { useCoinFlip, useGamersStats, useUserLastGame } from '@modules/coinflip/hooks';
import { bigNumberToString, getFormikError, isEqual } from '@shared/helpers';
import { useAmountInUsd } from '@shared/hooks';
import { amplitudeService } from '@shared/services';
import { Nullable, Token } from '@shared/types';
import { useToasts } from '@shared/utils';

import { CoinSide, TokenToPlay } from '../../stores';
import { useCoinflipValidation } from './use-coinflip.validation';

export enum FormFields {
  coinSide = 'coinSide',
  inputAmount = 'inputAmount'
}

export const useCoinflipGameFormViewModel = (
  tokenToPlay: TokenToPlay,
  token: Token,
  tokenBalance: Nullable<BigNumber>,
  payout: Nullable<BigNumber>,
  onAmountInputChange: (amountInput: string) => void,
  onCoinSideSelect: (coinSide: Nullable<CoinSide>) => void
) => {
  const { getGamersStats } = useGamersStats();
  const { getUserLastGame } = useUserLastGame();
  const { handleCoinFlip: handleCoinFlipPure } = useCoinFlip();

  const { showErrorToast } = useToasts();
  const { getAmountInUsd } = useAmountInUsd();

  const { decimals } = token.metadata;

  const validationSchema = useCoinflipValidation(tokenBalance);

  const handleCoinFlip = async () => {
    const amountInUsd = getAmountInUsd(new BigNumber(inputAmount), token);

    const logData = {
      asset: tokenToPlay,
      coinSide,
      amount: Number(inputAmount),
      amountInUsd: Number(amountInUsd)
    };

    try {
      amplitudeService.logEvent('CLICK_FLIP_BUTTON_CLICK', logData);

      await handleCoinFlipPure(new BigNumber(inputAmount), coinSide);
      onCoinSideSelect(null); // TODO: Remove when fix problem connection between store and validation
      formik.resetForm();
      await getGamersStats();
      await getUserLastGame();

      amplitudeService.logEvent('CLICK_FLIP_OPERATION_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);

      amplitudeService.logEvent('CLICK_FLIP_OPERATION_FAILED', {
        ...logData,
        error
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      [FormFields.coinSide]: '',
      [FormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleCoinFlip
  });

  const inputAmount = formik.values[FormFields.inputAmount];
  const coinSide = formik.values[FormFields.coinSide];

  // TODO: find better way
  useEffect(() => {
    formik.resetForm();
    // Skip formik dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenToPlay]);

  const handleInputAmountChange = (value: string) => {
    onAmountInputChange(value); // TODO: Remove when fix problem connection between store and validation
    formik.setFieldValue(FormFields.inputAmount, value);
  };

  const inputAmountError = getFormikError(formik, FormFields.inputAmount);

  const handleCoinSideSelect = (value: CoinSide) => {
    if (isEqual(coinSide, value)) {
      onCoinSideSelect(null); // TODO: Remove when fix problem connection between store and validation
      formik.setFieldValue(FormFields.coinSide, '');

      return;
    }

    onCoinSideSelect(value); // TODO: Remove when fix problem connection between store and validation
    formik.setFieldValue(FormFields.coinSide, value);

    amplitudeService.logEvent('CLICK_FLIP_COIN_SIDE_SELECT', {
      coinSide: value
    });
  };

  const coinSideError = getFormikError(formik, FormFields.coinSide);

  const balance = tokenBalance ? tokenBalance.toFixed() : null;
  const disabled = false;

  const payoutAmount = inputAmount && payout ? bigNumberToString(payout) : '';

  return {
    tokenBalance,
    payoutAmount,
    inputAmountError,
    handleFormSubmit: formik.handleSubmit,
    inputAmount,
    disabled,
    isSubmitting: formik.isSubmitting,
    balance,
    decimals,
    coinSideError,
    handleInputAmountChange,
    handleCoinSideSelect
  };
};
