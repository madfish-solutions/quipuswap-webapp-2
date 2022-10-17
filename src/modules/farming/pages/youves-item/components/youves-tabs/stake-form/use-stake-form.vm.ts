import { useEffect } from 'react';

import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';
import { FormikHelpers } from 'formik/dist/types';
import * as yup from 'yup';

import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { useAccountPkh, useTezos } from '@providers/use-dapp';
import { getFormikError, isExist } from '@shared/helpers';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const accountPkh = useAccountPkh();

  const userTokenBalance = new BigNumber(100);

  const handleSubmit = (values: FormValues, actions: FormikHelpers<FormValues>) => {
    // eslint-disable-next-line no-console
    console.log('submit', values);
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
      if (!tezos) {
        return;
      }
      // eslint-disable-next-line no-console
      console.log('load', await YouvesFarmingApi.getToken(tezos));
    })();
  }, [tezos]);

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
