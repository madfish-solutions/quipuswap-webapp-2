import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { DEFAULT_TOKEN } from '@config/tokens';
import { numberAsString, getFormikError, isExist, toDecimals } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableDividendsUnstake } from '../../../../hooks';
import { useFormValidation, useStableDividendsStakerBalance } from '../../../hooks';
import { FormFields, FormValues } from '../../../types';
import { StableDividendsFormViewProps } from '../stableswap-farm-form-view';

export const useUntakeFormViewModel = (): StableDividendsFormViewProps => {
  const { t } = useTranslation();

  const { stableDividendsUnstake } = useStableDividendsUnstake();

  const token = DEFAULT_TOKEN;

  const balance = useStableDividendsStakerBalance();

  const validationSchema = useFormValidation(balance ?? null);

  const handleStakeSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);

    const amount = new BigNumber(values[FormFields.inputAmount]);

    if (!amount.isNaN()) {
      const amountAtoms = toDecimals(amount, token);
      await stableDividendsUnstake(amountAtoms);
    }

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    initialValues: {
      [FormFields.inputAmount]: ''
    },
    validationSchema: validationSchema,
    onSubmit: handleStakeSubmit
  });

  const handleInputAmountChange = (value: string) => {
    const { decimals } = token.metadata;
    const { realValue } = numberAsString(value, decimals);
    formik.setFieldValue(FormFields.inputAmount, realValue);
  };

  const inputAmountError = getFormikError(formik, FormFields.inputAmount);

  const disabled = formik.isSubmitting || isExist(inputAmountError);

  const label = t('common|Amount');
  const buttonText = t('common|Unstake');
  const balanceText = t('common|Available balance');

  return {
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[FormFields.inputAmount],
    isSubmitting: formik.isSubmitting,
    label,
    balance,
    inputAmountError,
    tokens: token,
    handleInputAmountChange,
    disabled,
    buttonText,
    balanceText
  };
};
