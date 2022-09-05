import { useCallback } from 'react';

import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { ZERO_BAKER_ADDRESS } from '@config/constants';
import { useCreateNewLiquidityPool } from '@modules/new-liquidity/hooks/blockchain/use-new-liquidity-create-pool';
import {
  canDelegate,
  getInputsAmountFormFormikValues,
  isEmptyArray,
  isExist,
  isTezosToken,
  numberAsString,
  sortTokens
} from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { getInputSlugByIndex } from './components/helpers';
import { getTokensAndAmounts } from './get-tokens-and-amounts.helper';
import { MOCK_CHOOSED_TOKENS } from './mock-data';
import { NewLiqCreateInput } from './new-liquidity-create.interface';
import { useNewLiqudityCreateValidation } from './use-new-liquidity-create-validation';

export const useNewLiquidityCreatePageViewModel = () => {
  const { t } = useTranslation();
  const { createNewLiquidityPool } = useCreateNewLiquidityPool();

  const userTokensAndBalances = useTokensWithBalances(MOCK_CHOOSED_TOKENS);
  const shouldShowBakerInput = canDelegate(MOCK_CHOOSED_TOKENS);

  const validationSchema = useNewLiqudityCreateValidation(userTokensAndBalances, shouldShowBakerInput);

  const handleSubmit = useCallback(
    async <T extends Record<string, string>>(values: T, actions: FormikHelpers<T>) => {
      if (isEmptyArray(MOCK_CHOOSED_TOKENS.filter(isExist))) {
        return;
      }

      actions.setSubmitting(true);

      const valuesBN = getInputsAmountFormFormikValues(values);

      const candidate = shouldShowBakerInput ? values[NewLiqCreateInput.BAKER_INPUT] : ZERO_BAKER_ADDRESS;
      const tokensAndAmount = getTokensAndAmounts(valuesBN, MOCK_CHOOSED_TOKENS).sort((a, b) =>
        sortTokens(a.token, b.token)
      );

      if (isTezosToken(tokensAndAmount[0].token)) {
        tokensAndAmount.reverse();
      }

      await createNewLiquidityPool(tokensAndAmount, candidate);

      actions.resetForm();
      actions.setSubmitting(false);
    },
    [createNewLiquidityPool, shouldShowBakerInput]
  );

  const formik = useFormik({
    validationSchema,
    initialValues: {
      [NewLiqCreateInput.FIRST_INPUT]: '',
      [NewLiqCreateInput.SECOND_INPUT]: '',
      [NewLiqCreateInput.BAKER_INPUT]: ''
    },
    onSubmit: handleSubmit
  });

  const handleInputChange = (index: number) => {
    const localToken = MOCK_CHOOSED_TOKENS[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return async (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, localTokenDecimals);

      formik.setFieldValue(getInputSlugByIndex(index), realValue);
    };
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(NewLiqCreateInput.BAKER_INPUT, baker.address);
  };

  const data = userTokensAndBalances.map(({ token, balance }, index) => ({
    value: (formik.values as FormikValues)[getInputSlugByIndex(index)],
    error: (formik.errors as FormikErrors<FormikValues>)[getInputSlugByIndex(index)] as string,
    label: t('common|Input'),
    tokens: token,
    balance,
    onInputChange: handleInputChange(index)
  }));

  const bakerData = {
    value: (formik.values as FormikValues)[NewLiqCreateInput.BAKER_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[NewLiqCreateInput.BAKER_INPUT] as string,
    handleChange: handleBakerChange,
    shouldShowBakerInput
  };

  return { data, bakerData, onSubmit: formik.handleSubmit };
};
