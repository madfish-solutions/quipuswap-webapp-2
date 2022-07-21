import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { QUIPU_TOKEN } from '@config/tokens';
import { numberAsString, getFormikError, isExist, toAtomic } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { useStableDividendsStake } from '../../../../hooks';
import { useFormValidation } from '../../../hooks';
import { FormFields, FormValues } from '../../../types';
import { StableDividendsFormViewProps } from '../stabledividends-form-view';

export const useStakeFormViewModel = (): StableDividendsFormViewProps => {
  const { t } = useTranslation();

  const { stableDividendsStake } = useStableDividendsStake();

  const token = QUIPU_TOKEN;

  const balance = useTokenBalance(token);

  const validationSchema = useFormValidation(balance ?? null);

  const handleStakeSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    actions.setSubmitting(true);

    const amount = new BigNumber(values[FormFields.inputAmount]);

    if (!amount.isNaN()) {
      const amountAtoms = toAtomic(amount, token);
      await stableDividendsStake(amountAtoms);
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
