import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { DEFAULT_TOKEN } from '@config/tokens';
import { numberAsString, getFormikError, isExist, toDecimals } from '@shared/helpers';
import { useTranslation } from '@translation';

import { useStableswapFarmUnstake } from '../../../../hooks';
import { useFormValidation, useStableFarmStakerBalance } from '../../../hooks';
import { FormFields, FormValues } from '../../../types';
import { StableswapFarmFormViewProps } from '../stableswap-farm-form-view';

export const useUntakeFormViewModel = (): StableswapFarmFormViewProps => {
  const { t } = useTranslation();

  const { stableswapFarmUnstake } = useStableswapFarmUnstake();

  const token = DEFAULT_TOKEN;

  const balance = useStableFarmStakerBalance();

  const validationSchema = useFormValidation(balance ?? null);

  const handleStakeSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);

    const amount = new BigNumber(values[FormFields.inputAmount]);

    if (!amount.isNaN()) {
      const amountAtoms = toDecimals(amount, token);
      await stableswapFarmUnstake(amountAtoms);
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
    const decimals = token.metadata.decimals;
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
