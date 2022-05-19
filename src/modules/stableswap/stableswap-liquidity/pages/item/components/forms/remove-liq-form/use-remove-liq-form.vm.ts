import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { DEFAULT_DECIMALS } from '@config/constants';
import { useAccountPkh } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { useTranslation } from '@translation';

import {
  calculateTokensOutputsThroughLp,
  calculateTokensOutputsThrougToken,
  getFormikInitialValues,
  getFormikInitialValuesRemoveForm,
  getInputSlugByIndex,
  prepareFormikValue,
  setFormikValuesRemoveForm,
  prepareInputAmountAsBN
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { LP_INPUT_KEY } from './constants';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const DEFAULT_LENGTH = 0;

interface RemoveLiqFormValues {
  [key: string]: string;
}

export const useRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();

  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const labelInput = t('common|Input');
  const labelOutput = t('common|Output');
  const disabled = false;
  const isSubmitting = false;
  const balance = new BigNumber('10000');
  const lpBalance = new BigNumber('1000001');
  const lpExchangeRate = '1.5';
  //#endregion mock data

  const shouldShowBalanceButtons = !isNull(accountPkh);
  const inputsCount = (item && item.tokensInfo.length) ?? DEFAULT_LENGTH;
  const userBalances = Array(inputsCount ?? DEFAULT_LENGTH).fill(balance);

  const validationSchema = useRemoveLiqFormValidation(lpBalance, userBalances);

  const handleSubmit = async (_: RemoveLiqFormValues, actions: FormikHelpers<RemoveLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValuesRemoveForm(inputsCount),
    onSubmit: handleSubmit
  });

  const lpInputValue = formik.values[LP_INPUT_KEY];
  const lpError = formik.errors[LP_INPUT_KEY];

  useEffect(() => {
    return () => stableswapItemFormStore.clearStore();
  }, [stableswapItemFormStore]);

  if (isNull(item)) {
    return {
      data: [],
      lpInputValue,
      lpError,
      disabled,
      labelInput,
      labelOutput,
      isSubmitting,
      lpExchangeRate,
      shouldShowBalanceButtons,
      lpToken: null,
      lpDecimals: DEFAULT_DECIMALS,
      lpBalance: lpBalance.toFixed(),
      handleLpInputChange: noopMap,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply, lpToken } = item;

  const data = tokensInfo.map(({ token, exchangeRate, reserves: currentReserve }, indexOfCurrentInput) => {
    const decimals = token.metadata.decimals;
    const currentInputSlug = getInputSlugByIndex(indexOfCurrentInput);

    const handleInputChange = (inputAmount: string) => {
      const inputAmountBN = prepareInputAmountAsBN(inputAmount);
      const formikValues = getFormikInitialValues(tokensInfo.length);

      tokensInfo.forEach(({ reserves: calculatedReserve }, indexOfCalculatedInput) => {
        if (indexOfCurrentInput !== indexOfCalculatedInput) {
          const { lpValue, tokenValue } = calculateTokensOutputsThrougToken(
            inputAmountBN,
            currentReserve,
            totalLpSupply,
            calculatedReserve
          );

          setFormikValuesRemoveForm(formikValues, lpValue, tokenValue, indexOfCalculatedInput);
          stableswapItemFormStore.setLpAndTokenInputAmounts(lpValue, tokenValue, indexOfCalculatedInput);
        }
      });

      formikValues[currentInputSlug] = inputAmount;
      stableswapItemFormStore.setInputAmount(inputAmountBN, indexOfCurrentInput);
      formik.setValues(formikValues);
    };

    return {
      decimals,
      shouldShowBalanceButtons,
      tokenA: token,
      label: labelOutput,
      id: currentInputSlug,
      balance: balance.toFixed(),
      exchangeRate: exchangeRate.toFixed(),
      value: formik.values[currentInputSlug],
      error: formik.errors[currentInputSlug],
      onInputChange: handleInputChange
    };
  });

  const handleLpInputChange = (inputAmount: string) => {
    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const formikValues = getFormikInitialValues(tokensInfo.length);

    const tokenOutputs = calculateTokensOutputsThroughLp(inputAmountBN, totalLpSupply, tokensInfo);
    tokenOutputs.forEach((amount, indexOfTokenInput) => {
      stableswapItemFormStore.setInputAmount(amount, indexOfTokenInput);

      formikValues[getInputSlugByIndex(indexOfTokenInput)] = prepareFormikValue(amount);
    });

    formikValues[LP_INPUT_KEY] = inputAmount;

    formik.setValues(formikValues);
    stableswapItemFormStore.setLpInputAmount(inputAmountBN);
  };

  return {
    data,
    lpToken,
    lpInputValue,
    lpError,
    disabled,
    labelInput,
    labelOutput,
    isSubmitting,
    lpExchangeRate,
    shouldShowBalanceButtons,
    lpDecimals: lpToken.metadata.decimals,
    lpBalance: lpBalance.toFixed(),
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
