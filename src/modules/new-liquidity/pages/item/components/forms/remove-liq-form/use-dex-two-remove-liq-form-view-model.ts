import { FormikErrors, FormikValues, useFormik } from 'formik';

import { numberAsString } from '@shared/helpers';
import { useTokenBalance } from '@shared/hooks';
import { useTranslation } from '@translation';

import { extractTokens, getInputSlugByIndexRemove, getUserBalances } from '../helpers/forms.helpers';
import { MOCK_ITEM } from '../helpers/mock-item';
import { LP_TOKEN } from '../helpers/mock-lp-token';
import { useDexTwoRemoveLiqValidation } from './use-dex-two-remove-liq-form-validation';

export enum Input {
  FIRST_ADD_LIQ_INPUT = 'remove-liq-input-0',
  SECOND_ADD_LIQ_INPUT = 'remove-liq-input-1',
  LP_INPUT = 'remove-liq-input-2'
}

export const useDexTwoRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const userBalances = getUserBalances(MOCK_ITEM.tokensInfo);

  const lpTokenBalance = useTokenBalance(LP_TOKEN);
  const lpTokenMetadata = LP_TOKEN.metadata;

  const handleSubmit = () => {
    // eslint-disable-next-line no-console
    console.log('submit');
  };
  // TODO: validation for lpInput
  const validationSchema = useDexTwoRemoveLiqValidation(userBalances, MOCK_ITEM, lpTokenBalance!, lpTokenMetadata);

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [Input.FIRST_ADD_LIQ_INPUT]: '',
      [Input.SECOND_ADD_LIQ_INPUT]: '',
      [Input.LP_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const handleLpInputChange = () => {
    const decimals = LP_TOKEN.metadata.decimals;

    return async (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, decimals);

      formik.setFieldValue(Input.LP_INPUT, realValue);
    };
  };

  const handleInputChange = (index: number) => {
    const localToken = extractTokens(MOCK_ITEM.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return async (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, localTokenDecimals);
      const formikKey = getInputSlugByIndexRemove(index);

      formik.setFieldValue(formikKey, realValue);
    };
  };
  // TODO: check is this a good way to transfer data to LP
  const lpData = {
    disabled: false,
    value: (formik.values as FormikValues)[Input.LP_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[Input.LP_INPUT] as string,
    label: t('common|Input'),
    tokens: LP_TOKEN,
    balance: lpTokenBalance,
    onInputChange: handleLpInputChange()
  };

  const data = MOCK_ITEM.tokensInfo.map((_, index) => {
    const inputSlug = getInputSlugByIndexRemove(index);
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
