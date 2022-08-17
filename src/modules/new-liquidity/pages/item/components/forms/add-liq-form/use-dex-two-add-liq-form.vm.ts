import { FormikErrors, FormikValues, useFormik } from 'formik';

import { isTezosToken, numberAsString } from '@shared/helpers';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getInputSlugByIndex, extractTokens, getUserBalances } from '../helpers/forms.helpers';
import { MOCK_ITEM } from './mock-item';
import { useDexTwoAddLiqValidation } from './use-dex-two-add-liq-form-validation';

export enum Input {
  FIRST_ADD_LIQ_INPUT = 'add-liq-input-0',
  SECOND_ADD_LIQ_INPUT = 'add-liq-input-1',
  BAKER_INPUT = 'baker-input'
}

export const useDexTwoAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const userBalances = getUserBalances(MOCK_ITEM.tokensInfo);

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };

  const validationSchema = useDexTwoAddLiqValidation(userBalances, MOCK_ITEM);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [Input.FIRST_ADD_LIQ_INPUT]: '',
      [Input.SECOND_ADD_LIQ_INPUT]: '',
      [Input.BAKER_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const handleInputChange = (index: number) => {
    const localToken = extractTokens(MOCK_ITEM.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return async (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, localTokenDecimals);
      const formikKey = getInputSlugByIndex(index);

      formik.setFieldValue(formikKey, realValue);
    };
  };

  const onBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(Input.BAKER_INPUT, baker.address);
  };

  const data = MOCK_ITEM.tokensInfo.map((_, index) => {
    const inputSlug = getInputSlugByIndex(index);
    const value = (formik.values as FormikValues)[inputSlug];
    const error = (formik.errors as FormikErrors<FormikValues>)[inputSlug] as string;
    const token = MOCK_ITEM.tokensInfo[index].token;

    return {
      value,
      error,
      index,
      decimals: token.metadata.decimals,
      tokens: token,
      label: t('common|Input'),
      balance: userBalances[index],
      onInputChange: handleInputChange(index)
    };
  });

  const bakerData = {
    value: (formik.values as FormikValues)[Input.BAKER_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[Input.BAKER_INPUT] as string,
    handleChange: onBakerChange,
    shouldShowBakerInput: MOCK_ITEM.tokensInfo.some(({ token }) => isTezosToken(token))
  };

  return { data, onSubmit: formik.handleSubmit, bakerData };
};
