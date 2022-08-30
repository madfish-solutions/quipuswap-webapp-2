import { useCallback, useEffect, useState } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import {
  extractTokens,
  getInputsAmountFormFormikValues,
  isExist,
  isNull,
  numberAsString,
  placeDecimals,
  saveBigNumber,
  toFixed
} from '@shared/helpers';
import { useTokensWithBalances } from '@shared/hooks';
import { useChooseTokens } from '@shared/modals/tokens-modal';
import { SINGLE_TOKEN_VALUE } from '@shared/modals/tokens-modal/tokens-modal.store';
import { useTokensModalStore } from '@shared/modals/tokens-modal/use-tokens-modal-store';
import { Token } from '@shared/types';

import {
  calculateOutputWithToken,
  calculateShares,
  getFormikInitialValues,
  getInputSlugByIndex
} from '../../../../../../helpers';
import { useAddStableswapLiquidity, useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { getCurrentTokensAndBalances } from '../helpers';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';
import { useAddLiqFormHelper } from './use-add-liq-form.helper';
import { useZeroInputsError } from './use-zero-inputs-error';

const DEFAULT_LENGTH = 0;

export interface AddLiqFormValues {
  [key: string]: string;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const useAddLiqFormViewModel = () => {
  const tokensModalStore = useTokensModalStore();
  const { chooseTokens } = useChooseTokens();
  const { addStableswapLiquidity } = useAddStableswapLiquidity();

  const { item } = useStableswapItemStore();
  const formStore = useStableswapItemFormStore();

  const itemTokens = extractTokens(item?.tokensInfo ?? []);
  const itemBalances = useTokensWithBalances(itemTokens);

  const choosedTokensBalances = useTokensWithBalances(tokensModalStore.singleChoosenTokens.filter(isExist));

  const userCurrentTokensAndBalances = getCurrentTokensAndBalances(itemBalances, choosedTokensBalances);

  const [choosedToken, setChoosedToken] = useState<Nullable<Array<Token>>>(null);

  const validationSchema = useAddLiqFormValidation(userCurrentTokensAndBalances, formStore.isBalancedProportion);

  const { isZeroInputsError } = useZeroInputsError();
  const handleSubmit = useCallback(
    async (values: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
      const isZeroInputs = isZeroInputsError(values);

      if (isZeroInputs) {
        return;
      }

      actions.setSubmitting(true);
      const inputAmounts = getInputsAmountFormFormikValues(values);
      await addStableswapLiquidity(inputAmounts);
      formStore.clearStore();
      actions.resetForm();
      actions.setSubmitting(false);
    },
    [addStableswapLiquidity, formStore, isZeroInputsError]
  );

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(item?.tokensInfo.length ?? DEFAULT_LENGTH),
    onSubmit: handleSubmit
  });

  const { label, tooltip, disabled, isSubmitting, shouldShowZeroInputsAlert } = useAddLiqFormHelper(formik);

  useEffect(() => {
    return () => {
      tokensModalStore.clearChooseToken();
      formStore.clearStore();
    };
  }, [formStore, tokensModalStore]);

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo, totalLpSupply, lpToken } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const handleImbalancedInputChange = (index: number) => {
    const localToken = extractTokens(item.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return async (inputAmount: string) => {
      const { fixedValue } = numberAsString(inputAmount, localTokenDecimals);
      const formikKey = getInputSlugByIndex(index);

      formik.setFieldValue(formikKey, fixedValue);
    };
  };

  const handleBalancedInputChange = (reserves: BigNumber, index: number) => {
    const localToken = extractTokens(item.tokensInfo)[index];
    const localTokenDecimals = localToken.metadata.decimals;

    return (inputAmount: string) => {
      const { realValue, fixedValue } = numberAsString(inputAmount, localTokenDecimals);
      const inputAmountBN = saveBigNumber(fixedValue, null);
      formikValues[getInputSlugByIndex(index)] = realValue;

      const shares = calculateShares(inputAmountBN, reserves, totalLpSupply);
      const fixedShares = shares && placeDecimals(shares, lpToken);

      const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve, token }, indexOfCalculatedInput) => {
        if (index === indexOfCalculatedInput) {
          return inputAmountBN;
        }

        return calculateOutputWithToken(fixedShares, totalLpSupply, calculatedReserve, token);
      });

      calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
        if (indexOfCalculatedInput !== index) {
          formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
        }
      });
      formik.setValues(formikValues);
    };
  };

  const handleInputChange = (reserves: BigNumber, index: number) =>
    formStore.isBalancedProportion ? handleBalancedInputChange(reserves, index) : handleImbalancedInputChange(index);

  const handleSelectTokensClick = async () => {
    const chosenTokens = await chooseTokens({
      tokens: choosedToken,
      disabledTokens: tokensModalStore.singleChoosenTokens.filter(isExist),
      min: SINGLE_TOKEN_VALUE,
      max: SINGLE_TOKEN_VALUE
    });

    tokensModalStore.setChooseToken(chosenTokens?.[0]);

    setChoosedToken(chosenTokens);
  };

  const data = tokensInfo.map(({ reserves }, index) => ({
    index,
    label,
    formik,
    balance: userCurrentTokensAndBalances[index]?.balance,
    onInputChange: handleInputChange(reserves, index),
    onSelectorClick: handleSelectTokensClick
  }));

  const handleSwitcherClick = (state: boolean) => formStore.setIsBalancedProportion(state);

  return {
    data,
    tooltip,
    disabled,
    isSubmitting,
    isZeroInputsError,
    handleSelectTokensClick,
    shouldShowZeroInputsAlert,
    switcherValue: formStore.isBalancedProportion,
    handleSwitcherClick,
    handleSubmit: formik.handleSubmit
  };
};
