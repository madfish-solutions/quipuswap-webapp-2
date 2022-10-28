import { useCallback } from 'react';

import { FormikErrors, FormikHelpers, FormikValues, useFormik } from 'formik';

import { SINGLE_TOKEN_VALUE, ZERO_BAKER_ADDRESS } from '@config/constants';
import {
  canDelegate,
  getInputsAmountFormFormikValues,
  isExist,
  isTezosToken,
  numberAsString,
  sortTokens
} from '@shared/helpers';
import { useTokensBalancesOnly } from '@shared/hooks';
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { useTokensModalStore } from '@shared/modals/tokens-modal/use-tokens-modal-store';
import { WhitelistedBaker } from '@shared/types';
import { useTranslation } from '@translation';

import { useCreateLiquidityPool } from '../../hooks/blockchain/use-liquidity-create-pool';
import { DexTwoCreateFormCommonData } from './components/dex-two-create-form/dex-two-create-form.types';
import { getInputSlugByIndex } from './components/helpers';
import { getTokensAndAmounts } from './get-tokens-and-amounts.helper';
import { NewLiqCreateInput } from './new-liquidity-create.interface';
import { useIsPoolExist } from './use-is-pool-exist';
import { useNewLiqudityCreateValidation } from './use-new-liquidity-create-validation';

const ZERO_DECIMALS = 0;

export const useNewLiquidityCreatePageViewModel = () => {
  const { chooseTokens } = useChooseTokens();
  const { t } = useTranslation();
  const { createNewLiquidityPool } = useCreateLiquidityPool();
  const tokensModalStore = useTokensModalStore();
  const { chosenTokensSingleModal } = tokensModalStore;

  const { isPoolExist, existingPoolLink } = useIsPoolExist(chosenTokensSingleModal);

  const userBalances = useTokensBalancesOnly(chosenTokensSingleModal.filter(isExist));
  const shouldShowBakerInput = canDelegate(chosenTokensSingleModal);

  const validationSchema = useNewLiqudityCreateValidation(chosenTokensSingleModal, userBalances, shouldShowBakerInput);

  const handleSubmit = useCallback(
    async <T extends Record<string, string>>(values: T, actions: FormikHelpers<T>) => {
      if (!chosenTokensSingleModal.every(isExist)) {
        return;
      }

      actions.setSubmitting(true);

      const valuesBN = getInputsAmountFormFormikValues(values);

      const candidate = shouldShowBakerInput ? values[NewLiqCreateInput.BAKER_INPUT] : ZERO_BAKER_ADDRESS;
      const tokensAndAmount = getTokensAndAmounts(valuesBN, chosenTokensSingleModal).sort((a, b) =>
        sortTokens(a.token, b.token)
      );

      if (isTezosToken(tokensAndAmount[0].token)) {
        tokensAndAmount.reverse();
      }

      await createNewLiquidityPool(tokensAndAmount, candidate);

      actions.resetForm();
      actions.setSubmitting(false);
    },
    [chosenTokensSingleModal, createNewLiquidityPool, shouldShowBakerInput]
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
    const localToken = chosenTokensSingleModal[index];
    const localTokenDecimals = localToken ? localToken.metadata.decimals : ZERO_DECIMALS;

    return async (inputAmount: string) => {
      const { realValue } = numberAsString(inputAmount, localTokenDecimals);

      formik.setFieldValue(getInputSlugByIndex(index), realValue);
    };
  };

  const handleBakerChange = (baker: WhitelistedBaker) => {
    formik.setFieldValue(NewLiqCreateInput.BAKER_INPUT, baker.address);
  };

  const handleSelectTokensClick = useCallback(
    async (index: number) => {
      tokensModalStore.setInputIndex(index);
      const [token] =
        (await chooseTokens({
          disabledTokens: chosenTokensSingleModal.filter(isExist),
          min: SINGLE_TOKEN_VALUE,
          max: SINGLE_TOKEN_VALUE
        })) ?? [];

      tokensModalStore.setChooseToken(token);
    },
    [tokensModalStore, chooseTokens, chosenTokensSingleModal]
  );

  const data = chosenTokensSingleModal.map((token, index) => ({
    value: (formik.values as FormikValues)[getInputSlugByIndex(index)],
    error: (formik.errors as FormikErrors<FormikValues>)[getInputSlugByIndex(index)] as string,
    label: t('common|Input'),
    tokens: token ?? undefined,
    balance: userBalances[index],
    disabled: !Boolean(token),
    onInputChange: handleInputChange(index),
    onSelectorClick: async () => handleSelectTokensClick(index)
  }));

  const bakerData = {
    value: (formik.values as FormikValues)[NewLiqCreateInput.BAKER_INPUT],
    error: (formik.errors as FormikErrors<FormikValues>)[NewLiqCreateInput.BAKER_INPUT] as string,
    handleChange: handleBakerChange,
    shouldShowBakerInput
  };

  const disabled = !formik.isValid || formik.isSubmitting || isPoolExist;

  const commonData = {
    disabled,
    loading: formik.isSubmitting,
    isPoolExist,
    existingPoolLink
  } as DexTwoCreateFormCommonData;

  return { data, bakerData, onSubmit: formik.handleSubmit, commonData };
};
