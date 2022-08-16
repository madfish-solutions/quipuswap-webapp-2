import BigNumber from 'bignumber.js';
import { useFormik } from 'formik';

import { QUIPU_TOKEN } from '@config/tokens';
import { getFormikError } from '@shared/helpers';

import { useDexTwoAddLiqValidation } from './use-dex-two-add-liq-form-validation';

export enum Input {
  FIRST = 'firstInput',
  SECOND = 'secindInput'
}

export const useDexTwoAddLiqFormViewModel = () => {
  const quipuBalance = new BigNumber(20);

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  const onFirstInputChange = (value: string) => {
    formik.setFieldValue(Input.FIRST, value);
  };

  const onSecondtInputChange = (value: string) => {
    formik.setFieldValue(Input.SECOND, value);
  };

  const validationSchema = useDexTwoAddLiqValidation(QUIPU_TOKEN, quipuBalance);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [Input.FIRST]: '',
      [Input.SECOND]: ''
    },
    onSubmit: handleSubmit
  });

  const firstInputAmountError = getFormikError(formik, Input.FIRST);
  const secondInputAmountError = getFormikError(formik, Input.SECOND);

  const data = [
    {
      value: formik.values[Input.FIRST],
      label: 'Input',
      onInputChange: onFirstInputChange,
      tokens: QUIPU_TOKEN,
      balance: quipuBalance,
      error: firstInputAmountError
    },
    {
      value: formik.values[Input.SECOND],
      label: 'Input',
      onInputChange: onSecondtInputChange,
      tokens: QUIPU_TOKEN,
      balance: quipuBalance,
      error: secondInputAmountError
    }
  ];

  return { data, onSubmit: formik.handleSubmit };
};
