import BigNumber from 'bignumber.js';
import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { useNewLiquidityItemStore } from '@modules/new-liquidity/hooks';
import { useAddLiquidity } from '@modules/new-liquidity/hooks/blockchain';
import { isTezosToken, numberAsString, saveBigNumber } from '@shared/helpers';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getInputSlugByIndex, extractTokens, getUserBalances } from '../helpers/forms.helpers';
import { useDexTwoAddLiqValidation } from './use-dex-two-add-liq-form-validation';

export enum Input {
  FIRST_ADD_LIQ_INPUT = 'add-liq-input-0',
  SECOND_ADD_LIQ_INPUT = 'add-liq-input-1',
  BAKER_INPUT = 'baker-input'
}

export const getInputsAmountFormFormikValues = <T extends { [key: string]: string }>(values: T) =>
  Object.values(values).map(value => saveBigNumber(value, new BigNumber('0')));

export const useDexTwoAddLiqFormViewModel = () => {
  const { t } = useTranslation();
  const { item } = useNewLiquidityItemStore();
  const { addLiquidity } = useAddLiquidity();

  // TODO: remove any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (values: FormikValues, actions: FormikHelpers<any>) => {
    actions.setSubmitting(true);

    const candidate = values[Input.BAKER_INPUT];
    const inputAmounts = getInputsAmountFormFormikValues(values);

    addLiquidity(inputAmounts, candidate);

    actions.resetForm();
    actions.setSubmitting(false);
  };

  const userBalances = getUserBalances(item.tokensInfo);

  const shouldShowBakerInput = item.tokensInfo.some(({ token }) => isTezosToken(token));

  const validationSchema = useDexTwoAddLiqValidation(userBalances, item, shouldShowBakerInput);

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
    const localToken = extractTokens(item.tokensInfo)[index];
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

  const data = item.tokensInfo.map((_, index) => {
    const inputSlug = getInputSlugByIndex(index);
    const value = (formik.values as FormikValues)[inputSlug];
    const error = (formik.errors as FormikErrors<FormikValues>)[inputSlug] as string;
    const token = item.tokensInfo[index].token;

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
    shouldShowBakerInput
  };

  return { data, onSubmit: formik.handleSubmit, bakerData };
};
