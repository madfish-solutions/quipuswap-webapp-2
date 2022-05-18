import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { isNull } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Standard } from '@shared/types';
import { useTranslation } from '@translation';

import {
  calculateTokensInputs,
  calculateTokensOutputsThroughLp,
  getFormikInitialValues,
  getInputSlugByIndex
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const ONE = 1;
const ZERO = 0;

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

  const lpValue = formik.values['lp-input'];
  const lpError = formik.errors['lp-input'];

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
      handleLpInputChange: noopMap,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply } = item;
  const reservesAll = tokensInfo.map(({ reserves }) => reserves);

  const handleLpInputChange = (inputAmount: string) => {
    stableswapItemFormStore.setLpInputAmount(new BigNumber(inputAmount));
    formik.setFieldValue('lp-input', inputAmount);
    const formikValues = getFormikInitialValues(tokensInfo.length);
    const out = calculateTokensOutputsThroughLp(inputAmount, totalLpSupply, reservesAll);
    out.forEach((amount, i) => {
      stableswapItemFormStore.setInputAmount(amount, i);

      formikValues[getInputSlugByIndex(i)] = amount;
    });
    formik.setValues(formikValues);
  };

  const data = tokensInfo.map((info, index) => {
    const token = info.token;
    const decimals = info.token.metadata.decimals;
    const currentInputSlug = getInputSlugByIndex(index);
    const label = labelOutput;

    const handleInputChange = (inputAmount: string) => {
      const formikValues = getFormikInitialValues(tokensInfo.length);

      let outputReserve: BigNumber;
      let outputAmount: Nullable<BigNumber>;
      const inputReserve: BigNumber = reservesAll[index];

      tokensInfo.forEach((_, i) => {
        outputReserve = reservesAll[i];
        outputAmount = calculateTokensInputs(inputAmount, inputReserve, totalLpSupply, outputReserve);
        stableswapItemFormStore.setInputAmount(outputAmount, i);

        formikValues[getInputSlugByIndex(i)] = outputAmount;
      });
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
