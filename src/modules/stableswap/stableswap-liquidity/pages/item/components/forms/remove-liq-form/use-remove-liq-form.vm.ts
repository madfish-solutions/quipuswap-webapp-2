import { BigNumber } from 'bignumber.js';
import { FormikHelpers, useFormik } from 'formik';

import { useAccountPkh } from '@providers/use-dapp';
import { isNull, prepareNumberAsString } from '@shared/helpers';
import { noopMap } from '@shared/mapping';
import { Standard } from '@shared/types';
import { useTranslation } from '@translation';

import {
  calculateTokensOutputsThroughLp,
  calculateTokensOutputsThrougToken,
  getFormikInitialValues,
  getFormikInitialValuesRemoveForm,
  getInputSlugByIndex,
  prepareFormikValue
} from '../../../../../../helpers';
import { useStableswapItemFormStore, useStableswapItemStore } from '../../../../../../hooks';
import { LP_INPUT_KEY } from './constants';
import { useRemoveLiqFormValidation } from './use-remove-liq-form-validation';

const ZERO = 0;

const LP_TOKEN = {
  type: Standard.Fa2,
  contractAddress: '',
  fa2TokenId: 0,
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    symbol: 'LP TOKEN',
    name: 'LP Governance Token',
    thumbnailUri: ''
  }
};

interface RemoveLiqFormValues {
  [key: string]: string;
}

export const useRemoveLiqFormViewModel = () => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();

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
  const lpBalance = new BigNumber('1000001');
  const lpExchangeRate = '1.5';
  //#endregion mock data

  const shouldShowBalanceButtons = !isNull(accountPkh);
  const inputsCount = (item && item.tokensInfo.length) ?? ZERO;
  const userBalances = Array(inputsCount ?? ZERO).fill(balance);

  const validationSchema = useRemoveLiqFormValidation(lpBalance, userBalances);

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

  const lpInputValue = formik.values[LP_INPUT_KEY];
  const lpError = formik.errors[LP_INPUT_KEY];

  if (isNull(item)) {
    return {
      data: [],
      lpInputValue,
      lpError,
      disabled,
      labelInput,
      labelOutput,
      isSubmitting,
      lpExchangeRate,
      shouldShowBalanceButtons,
      lpToken: LP_TOKEN,
      lpBalance: lpBalance.toFixed(),
      handleLpInputChange: noopMap,
      handleSubmit: formik.handleSubmit
    };
  }

  const { tokensInfo, totalLpSupply } = item;
  const reservesAll = tokensInfo.map(({ reserves }) => reserves);

  const handleLpInputChange = (inputAmount: string) => {
    const preparedLpInput = prepareNumberAsString(inputAmount);
    const inputAmountBN = new BigNumber(preparedLpInput);
    const formikValues = getFormikInitialValues(tokensInfo.length);

    const tokenOutputs = calculateTokensOutputsThroughLp(inputAmountBN, totalLpSupply, reservesAll);
    tokenOutputs.forEach((amount, indexOfTokenInput) => {
      stableswapItemFormStore.setInputAmount(amount, indexOfTokenInput);

      formikValues[getInputSlugByIndex(indexOfTokenInput)] = prepareFormikValue(amount);
    });

    formikValues[LP_INPUT_KEY] = inputAmount;

    formik.setValues(formikValues);
    stableswapItemFormStore.setLpInputAmount(inputAmountBN);
  };

  const data = tokensInfo.map((info, indexOfCurrentInput) => {
    const { token, exchangeRate } = info;
    const decimals = token.metadata.decimals;
    const currentInputSlug = getInputSlugByIndex(indexOfCurrentInput);
    const label = labelOutput;

    const handleInputChange = (inputAmount: string) => {
      const preparedTokenInput = prepareNumberAsString(inputAmount);

      const inputAmountBN = new BigNumber(preparedTokenInput);
      const formikValues = getFormikInitialValues(tokensInfo.length);

      const inputReserve: BigNumber = reservesAll[indexOfCurrentInput];

      tokensInfo.forEach((_, indexOfCalculatedInput) => {
        if (indexOfCurrentInput === indexOfCalculatedInput) {
          return;
        }

        const outputReserve = reservesAll[indexOfCalculatedInput];

        const { lpValue, tokenValue } = calculateTokensOutputsThrougToken(
          inputAmountBN,
          inputReserve,
          totalLpSupply,
          outputReserve
        );

        formikValues[LP_INPUT_KEY] = prepareFormikValue(lpValue);
        formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = prepareFormikValue(tokenValue);

        stableswapItemFormStore.setLpInputAmount(lpValue);
        stableswapItemFormStore.setInputAmount(tokenValue, indexOfCalculatedInput);
      });

      formikValues[getInputSlugByIndex(indexOfCurrentInput)] = inputAmount;

      stableswapItemFormStore.setInputAmount(inputAmountBN, indexOfCurrentInput);
      formik.setValues(formikValues);
    };

    return {
      label,
      decimals,
      shouldShowBalanceButtons,
      tokenA: token,
      id: currentInputSlug,
      balance: balance.toFixed(),
      exchangeRate: exchangeRate.toFixed(),
      value: formik.values[currentInputSlug],
      error: formik.errors[currentInputSlug],
      onInputChange: handleInputChange
    };
  });

  return {
    data,
    lpInputValue,
    lpError,
    disabled,
    labelInput,
    labelOutput,
    isSubmitting,
    lpExchangeRate,
    shouldShowBalanceButtons,
    lpToken: LP_TOKEN,
    lpBalance: lpBalance.toFixed(),
    handleLpInputChange,
    handleSubmit: formik.handleSubmit
  };
};
