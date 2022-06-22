import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { DEFAULT_TOKEN } from '@config/tokens';
import { numberAsString, getFormikError, isExist, toDecimals } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useStableswapFarmStake } from '../../../../hooks';
import { useFormValidation } from '../../../hooks';
import { FormFields, FormValues } from '../../../types';
import { StableswapFarmFormViewProps } from '../stableswap-farm-form-view';

export const useStakeFormViewModel = (): StableswapFarmFormViewProps => {
  const { t } = useTranslation();

  const { stableswapFarmStake } = useStableswapFarmStake();

  const token = DEFAULT_TOKEN;

  const balance = useTokenBalance(token);

  const validationSchema = useFormValidation(balance ?? null);

  const handleStakeSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);

    const amount = new BigNumber(values[FormFields.inputAmount]);

    if (!amount.isNaN()) {
      const amountAtoms = toDecimals(amount, token);
      await stableswapFarmStake(amountAtoms);
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
  const buttonText = t('common|Stake');

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
    buttonText
  };
};