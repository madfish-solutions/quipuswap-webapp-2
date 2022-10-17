import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { LpTokensApi } from '@blockchain';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { defined, getFormikError, isExist } from '@shared/helpers';
import { balanceAmountSchema } from '@shared/validators';

import { YouvesFarmingApi } from '../../../../../api/blockchain/youves-farming.api';
import { StakeFormFields } from '../../../../item/components/farming-tabs/stake-form/stake-form.interface';

enum FormFields {
  inputAmount = 'inputAmount'
}

interface FormValues {
  [FormFields.inputAmount]: string;
}

const getValidationSchema = (userBalance: Nullable<BigNumber>) =>
  yup.object().shape({
    [StakeFormFields.inputAmount]: balanceAmountSchema(userBalance).required('Value is required')
  });

export const useStakeFormViewModel = () => {
  const tezos = useTezos();
  const accountPkh = useAccountPkh();

  const userTokenBalance = new BigNumber(100);

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // eslint-disable-next-line no-console
    console.log('submit', values);
    actions.setSubmitting(true);
    try {
      await YouvesFarmingApi.deposit(defined(tezos), defined(accountPkh), 0, values.inputAmount);
      actions.resetForm();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('error', error);
    }
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema: getValidationSchema(userTokenBalance),
    initialValues: {
      [FormFields.inputAmount]: ''
    },
    onSubmit: handleSubmit
  });

  const inputAmountChange = async (value: string) => await formik.setFieldValue(FormFields.inputAmount, value);

  useEffect(() => {
    (async () => {
      if (!tezos || !accountPkh) {
        return;
      }
      const lpToken = await YouvesFarmingApi.getToken(tezos);
      // eslint-disable-next-line no-console
      console.log('load.lpToken', lpToken);

      const tokens = await LpTokensApi.getTokens(tezos, lpToken);
      // eslint-disable-next-line no-console
      console.log('load.tokens', tokens);

      // eslint-disable-next-line no-console
      console.log('load.stakes', await YouvesFarmingApi.getStakes(tezos, accountPkh));
    })();
  }, [accountPkh, tezos]);

  const disabled = formik.isSubmitting || !isExist(tezos) || !isExist(accountPkh);

  return {
    userTokenBalance,
    tokens: [QUIPU_TOKEN, TEZOS_TOKEN],
    handleSubmit: formik.handleSubmit,
    inputAmount: formik.values[FormFields.inputAmount],
    inputAmountError: getFormikError(formik, FormFields.inputAmount),
    handleInputAmountChange: inputAmountChange,
    isSubmitting: formik.isSubmitting,
    disabled
  };
};
