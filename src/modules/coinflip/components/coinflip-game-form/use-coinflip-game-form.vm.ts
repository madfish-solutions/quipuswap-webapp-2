import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { useFormik } from 'formik';

import { IS_NETWORK_MAINNET } from '@config/config';
import { useCoinFlip, useGamersStats, useUserLastGame } from '@modules/coinflip/hooks';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { bigNumberToString, getFormikError, getTokenSlug, isEqual } from '@shared/helpers';
import { amplitudeService } from '@shared/services';
import { Nullable, Token } from '@shared/types';
import { useToasts } from '@shared/utils';

import { CoinSide, TokenToPlay } from '../../stores';
import { useCoinflipValidation } from './use-coinflip.validation';

const MOCK_TESTNET_EXCHANGE_RATE = 1.5;

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
  const exchangeRates = useNewExchangeRates();
  const tokenSlug = getTokenSlug(token);

  const { decimals } = token.metadata;

  const validationSchema = useCoinflipValidation(tokenBalance);

  const handleCoinFlip = async () => {
    const logData = {
      asset: tokenToPlay,
      coinSide,
      amount: Number(inputAmount),
      amountInUsd: Number(
        new BigNumber(inputAmount).multipliedBy(
          IS_NETWORK_MAINNET ? exchangeRates[tokenSlug] : MOCK_TESTNET_EXCHANGE_RATE
        )
      )
    };

    try {
      amplitudeService.logEvent('CLICK_FLIP_BUTTON', logData);

      await handleCoinFlipPure(new BigNumber(inputAmount), coinSide);
      onCoinSideSelect(null); // TODO: Remove when fix problem connection between store and validation
      formik.resetForm();
      await getGamersStats();
      await getUserLastGame();

      amplitudeService.logEvent('CLICK_FLIP_BUTTON_SUCCESS', logData);
    } catch (error) {
      showErrorToast(error as Error);

      amplitudeService.logEvent('CLICK_FLIP_BUTTON_FAILED', {
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

    amplitudeService.logEvent('COIN_SIDE_SELECTED', {
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
