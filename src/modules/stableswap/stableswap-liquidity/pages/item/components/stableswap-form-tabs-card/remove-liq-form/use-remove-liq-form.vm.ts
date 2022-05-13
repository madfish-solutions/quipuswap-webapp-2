import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull, isEmptyString } from '@shared/helpers';
import { Standard } from '@shared/types';
import { useTranslation } from '@translation';

import { calculateTokensInputs, getFormikInitialValues, getInputSlugByIndex } from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const ONE = 1;
const ZERO = 0;
const DEFAULT_FORKIK_VALUE = '';

const LP_TOKEN = {
  type: Standard.Fa2,
  contractAddress: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
  fa2TokenId: 0,
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    symbol: 'LP TOKEN',
    name: 'LP Governance Token',
    thumbnailUri: ''
  }
};

interface AddLiqFormValues {
  [key: string]: string;
}

export const useRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();

  const stableswapItemStore = useStableswapItemStore();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const item = stableswapItemStore.item;

  //#region mock data
  //TODO: remove mockdata implement real one
  const labelInput = t('common|Input');
  const labelOutput = t('common|Output');
  const disabled = false;
  const isSubmitting = false;
  const balance = new BigNumber('10000');
  //#endregion mock data

  const inputsCount = item && item.tokensInfo.length + ONE;
  const userBalances = Array(inputsCount ?? ZERO).fill(balance);

  const validationSchema = useRemoveLiqFormValidation(balance, userBalances);

  const handleSubmit = async (_: AddLiqFormValues, actions: FormikHelpers<AddLiqFormValues>) => {
    actions.setSubmitting(true);

    formik.resetForm();
    actions.setSubmitting(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      'lp-input': '',
      ...getFormikInitialValues(inputsCount ?? ZERO)
    },
    onSubmit: handleSubmit
  });

  const handleLpInputChange = (inputAmount: string) => {
    formik.setFieldValue('lp-input', inputAmount);
  };

  const lpValue = '';
  const lpError = '';

  if (isNull(item)) {
    return {
      data: [],
      lpValue,
      lpError,
      disabled,
      labelInput,
      labelOutput,
      isSubmitting,
      lpToken: LP_TOKEN,
      handleLpInputChange,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply } = item;
  const reservesAll = tokensInfo.map(({ reserves }) => reserves);

  const data = tokensInfo.map((info, index) => {
    const token = info.token;
    const decimals = info.token.metadata.decimals;
    const currentInputSlug = getInputSlugByIndex(index);
    const label = labelOutput;

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
      decimals,
      tokenA: token,
      id: currentInputSlug,
      balance: balance.toFixed(),
      value: formik.values[currentInputSlug],
      error: formik.errors[currentInputSlug],
      onInputChange: handleInputChange
    };
  });

  return {
    data,
    lpValue,
    lpError,
    disabled,
    labelInput,
    labelOutput,
    isSubmitting,
    lpToken: LP_TOKEN,
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
