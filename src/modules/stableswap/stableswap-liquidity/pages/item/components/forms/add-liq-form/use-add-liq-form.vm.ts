import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull, isTokenEqual, multipliedIfPossible, prepareNumberAsString } from '@shared/helpers';
import { BalanceToken, useTokensBalances } from '@shared/hooks';
import { Token } from '@shared/types';
import { useTranslation } from '@translation';

import { calculateTokensInputs, getFormikInitialValues, getInputSlugByIndex } from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;

interface AddLiqFormValues {
  [key: string]: string;
}

const findBalanceToken = (balances: Array<BalanceToken>, token: Token) =>
  balances.find(value => isTokenEqual(value.token, token));

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();

  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const label = t('common|Input');
  const disabled = false;
  const isSubmitting = false;
  //#endregion mock data

  const balances = useTokensBalances(item?.tokensInfo.map(({ token }) => token));

  const validationSchema = useAddLiqFormValidation(
    (item?.tokensInfo ?? []).map(({ token }) => {
      const balanceWrapper = findBalanceToken(balances, token);

      return balanceWrapper?.balance ?? null;
    })
  );

  const handleSubmit = async (_: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(item?.tokensInfo.length ?? DEFAULT_LENGTH),
    onSubmit: handleSubmit
  });

  if (isNull(item)) {
    return {
      data: [],
      disabled,
      isSubmitting,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply } = item;
  const reservesAll = tokensInfo.map(({ reserves }) => reserves);

  const data = tokensInfo.map((info, indexOfCurrentInput) => {
    const { token, exchangeRate } = info;

    const currentInputSlug = getInputSlugByIndex(indexOfCurrentInput);

    const handleInputChange = (inputAmount: string) => {
      const preparedInputAmount = prepareNumberAsString(inputAmount);
      const inputAmountBN = new BigNumber(preparedInputAmount);
      const formikValues = getFormikInitialValues(tokensInfo.length);

      const inputAmountReserve = reservesAll[indexOfCurrentInput];

      tokensInfo.forEach((_, indexOfCalculatedInput) => {
        if (indexOfCurrentInput === indexOfCalculatedInput) {
          return;
        }

        const outputAmountReserve = reservesAll[indexOfCalculatedInput];

        const amount = calculateTokensInputs(inputAmountBN, inputAmountReserve, totalLpSupply, outputAmountReserve);
        stableswapItemFormStore.setInputAmount(amount, indexOfCalculatedInput);
        formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = amount ? amount.toFixed() : '';
      });

      formikValues[getInputSlugByIndex(indexOfCurrentInput)] = inputAmount;

      formik.setValues(formikValues);
    };

    const balance = findBalanceToken(balances, token)?.balance;

    const dollarEquivalent = multipliedIfPossible(formik.values[currentInputSlug], exchangeRate.toFixed());

    return {
      label,
      balance,
      tokens: token,
      id: currentInputSlug,
      dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent,
      value: formik.values[currentInputSlug],
      error: formik.errors[currentInputSlug],
      onInputChange: handleInputChange
    };
  });

  return {
    data,
    disabled,
    isSubmitting,
    handleSubmit: formik.handleSubmit
  };
};
