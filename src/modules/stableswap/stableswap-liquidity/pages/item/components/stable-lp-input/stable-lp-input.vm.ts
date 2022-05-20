import { useAccountPkh } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';
import { useTranslation } from '@translation';

import {
  calculateOutputWithLp,
  getInputSlugByIndex,
  prepareInputAmountAsBN,
  getFormikInitialValues,
  prepareFormikValue
} from '../../../../../helpers';
import { useStableswapItemStore, useStableswapItemFormStore } from '../../../../../hooks';
import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { LP_INPUT_KEY } from './constants';

export const useStableLpInputViewModel = (formik: IFormik<RemoveLiqFormValues>) => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo, totalLpSupply, lpToken } = item;

  const { decimals } = lpToken.metadata;

  const label = t('common|Input');

  const value = formik.values[LP_INPUT_KEY];
  const error = formik.errors[LP_INPUT_KEY];
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const formikValues = getFormikInitialValues(tokensInfo.length);

  const handleLpInputChange = (inputAmount: string) => {
    formikValues[LP_INPUT_KEY] = inputAmount;

    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const tokenOutputs = calculateOutputWithLp(inputAmountBN, totalLpSupply, tokensInfo);

    tokenOutputs.forEach((amount, indexOfTokenInput) => {
      formikValues[getInputSlugByIndex(indexOfTokenInput)] = prepareFormikValue(amount);
    });

    formik.setValues(formikValues);
    stableswapItemFormStore.setLpAndTokenInputAmounts(inputAmountBN, tokenOutputs);
  };

  return { label, value, error, lpToken, decimals, shouldShowBalanceButtons, handleLpInputChange };
};
