import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull, isEmptyString } from '@shared/helpers';
import { useTranslation } from '@translation';

import { calculateTokensInputs, getFormikInitialValues, getInputSlugByIndex } from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useAddLiqFormValidation } from './use-add-liq-form-validation';

const DEFAULT_LENGTH = 0;
const DEFAULT_FORKIK_VALUE = '';

interface AddLiqFormValues {
  [key: string]: string;
}

export const useAddLiqFormViewModel = () => {
  const { t } = useTranslation();

  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const label = t('common|Input');
  const disabled = false;
  const isSubmitting = false;
  const balance = '100000';
  //#endregion mock data

  const validationSchema = useAddLiqFormValidation(
    Array(item?.tokensInfo.length ?? DEFAULT_LENGTH).fill(new BigNumber(balance))
  );

  const handleSubmit = async (_: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: getFormikInitialValues(item?.tokensInfo.length ?? DEFAULT_LENGTH),
    onSubmit: handleSubmit
  });

  if (isNull(item)) {
    return {
      data: [],
      disabled,
      isSubmitting,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply } = item;
  const reservesAll = tokensInfo.map(({ reserves }) => reserves);

  const data = tokensInfo.map((info, index) => {
    const token = info.token;
    const decimals = info.token.metadata.decimals;
    const currentInputSlug = getInputSlugByIndex(index);

    const handleInputChange = (inputAmount: string) => {
      const formikValues = getFormikInitialValues(tokensInfo.length);

      if (isEmptyString(inputAmount)) {
        tokensInfo.forEach((_, i) => stableswapItemFormStore.setInputAmount(DEFAULT_FORKIK_VALUE, i));
      } else {
        const valueBN = new BigNumber(inputAmount);

        const outAmounts = calculateTokensInputs(valueBN, index, totalLpSupply, reservesAll);

        outAmounts.forEach((amount, i) => {
          stableswapItemFormStore.setInputAmount(amount, i);

          formikValues[getInputSlugByIndex(i)] = amount;
        });
      }
      formik.setValues(formikValues);
    };

    return {
      label,
      value: formik.values[currentInputSlug],
      balance,
      decimals,
      error: formik.errors[currentInputSlug],
      tokenA: token,
      id: currentInputSlug,
      onInputChange: handleInputChange
    };
  });

  return {
    data,
    disabled,
    isSubmitting,
    handleSubmit: formik.handleSubmit
  };
};
