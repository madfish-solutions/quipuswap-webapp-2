import BigNumber from 'bignumber.js';
import { FormikErrors, FormikValues, useFormik } from 'formik';

import { numberAsString } from '@shared/helpers';
import { useTranslation } from '@translation';

import { extractTokens, getInputSlugByIndex, getUserBalances } from '../helpers/forms.helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { useDexTwoRemoveLiqValidation } from './use-dex-two-remove-liq-form-validation';

export enum Input {
  LP_INPUT = 'lpInput',
  FIRST_ADD_LIQ_INPUT = 'add-liq-input-0',
  SECOND_ADD_LIQ_INPUT = 'add-liq-input-1'
}

export const useDexTwoRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const userBalances = getUserBalances(MOCK_ITEM.tokensInfo);

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };
  // TODO: validation for lpInput
  const validationSchema = useDexTwoRemoveLiqValidation(userBalances, MOCK_ITEM);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [Input.LP_INPUT]: '',
      [Input.FIRST_ADD_LIQ_INPUT]: '',
      [Input.SECOND_ADD_LIQ_INPUT]: ''
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
  // TODO: check is this a good way to transfer data to LP
  const lpData = {
    disabled: false,
    formik,
    label: t('common|Input'),
    balance: new BigNumber(10),
    onInputChange: handleInputChange
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
      label: t('common|Output'),
      balance: userBalances[index],
      hiddenPercentSelector: true,
      onInputChange: handleInputChange(index)
    };
  });

  return { data, onSubmit: formik.handleSubmit, lpData };
};
