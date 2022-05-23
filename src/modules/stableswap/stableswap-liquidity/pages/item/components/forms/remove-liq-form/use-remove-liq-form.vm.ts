import { useEffect } from 'react';

import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import { isNull, toFixed } from '@shared/helpers';

import {
  calculateLpValue,
  calculateOutputWithLp,
  calculateOutputWithToken,
  getFormikInitialValues,
  getFormikInitialValuesRemoveForm,
  getInputSlugByIndex,
  prepareInputAmountAsBN
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useTranslation } from './../../../../../../../../translation/use-translation';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const DEFAULT_LENGTH = 0;

export interface RemoveLiqFormValues {
  [key: string]: string;
}

// MOCKED BALANCES
const BALANCE = '1000';
const LP_BALANCE = '1000';
const BALANCE_BN = new BigNumber(BALANCE);
const LP_BALANCE_BN = new BigNumber(LP_BALANCE);

export const useRemoveLiqFormViewModel = () => {
  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const { t } = useTranslation();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const disabled = false;
  const isSubmitting = false;
  //#endregion mock data

  const inputsCount = (item && item.tokensInfo.length) ?? DEFAULT_LENGTH;
  const userBalances = Array(inputsCount).fill(BALANCE_BN);

  const validationSchema = useRemoveLiqFormValidation(LP_BALANCE_BN, userBalances);

  const handleSubmit = async (_: RemoveLiqFormValues, actions: FormikHelpers<RemoveLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValuesRemoveForm(inputsCount),
    onSubmit: handleSubmit
  });

  useEffect(() => {
    return () => stableswapItemFormStore.clearStore();
  }, [stableswapItemFormStore]);

  if (isNull(item)) {
    return null;
  }

  const labelInput = t('common|Input');
  const labelOutput = t('common|Output');
  const tooltip = t('common|Success');

  const { tokensInfo, totalLpSupply } = item;

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const setValues = (lpValue: Nullable<BigNumber>, calculatedValues: Array<Nullable<BigNumber>>) => {
    formik.setValues(formikValues);
    stableswapItemFormStore.setLpAndTokenInputAmounts(lpValue, calculatedValues);
  };

  const data = tokensInfo.map(({ reserves }, index) => {
    return {
      index,
      formik,
      label: labelInput,
      balance: BALANCE,
      onInputChange: (inputAmount: string) => {
        formikValues[getInputSlugByIndex(index)] = inputAmount;
        const inputAmountBN = prepareInputAmountAsBN(inputAmount);
        const lpValue = calculateLpValue(inputAmountBN, reserves, totalLpSupply);

        formikValues[LP_INPUT_KEY] = toFixed(lpValue);

        const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve }, indexOfCalculatedInput) => {
          if (index === indexOfCalculatedInput) {
            return inputAmountBN;
          }

          return calculateOutputWithToken(lpValue, totalLpSupply, calculatedReserve);
        });

        calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
          if (index !== indexOfCalculatedInput) {
            formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = toFixed(calculatedValue);
          }
        });

        setValues(lpValue, calculatedValues);
      }
    };
  });

  const handleLpInputChange = (inputAmount: string) => {
    formikValues[LP_INPUT_KEY] = inputAmount;

    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const tokenOutputs = calculateOutputWithLp(inputAmountBN, totalLpSupply, tokensInfo);

    tokenOutputs.forEach((amount, indexOfTokenInput) => {
      formikValues[getInputSlugByIndex(indexOfTokenInput)] = toFixed(amount);
    });

    setValues(inputAmountBN, tokenOutputs);
  };

  return {
    data,
    formik,
    tooltip,
    disabled,
    labelOutput,
    isSubmitting,
    lpBalance: LP_BALANCE,
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
