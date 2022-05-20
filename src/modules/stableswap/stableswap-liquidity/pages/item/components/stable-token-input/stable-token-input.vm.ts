import { useAccountPkh } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';
import { useTranslation } from '@translation';

import {
  calculateLpValue,
  getInputSlugByIndex,
  prepareInputAmountAsBN,
  getFormikInitialValues,
  calculateOutputWithToken,
  prepareFormikValue
} from '../../../../../helpers';
import { useStableswapItemStore, useStableswapItemFormStore } from '../../../../../hooks';
import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { LP_INPUT_KEY } from '../stable-lp-input';

export const useStableTokenInputViewModel = (formik: IFormik<RemoveLiqFormValues>, index: number) => {
  const { t } = useTranslation();
  const accountPkh = useAccountPkh();
  const stableswapItemFormStore = useStableswapItemFormStore();
  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo, totalLpSupply } = item;

  const token = tokensInfo[index].token;
  const { decimals } = token.metadata;

  const label = t('common|Output');

  const inputSlug = getInputSlugByIndex(index);
  const value = formik.values[inputSlug];
  const error = formik.errors[inputSlug];
  const shouldShowBalanceButtons = Boolean(accountPkh);

  const formikValues = getFormikInitialValues(tokensInfo.length);
  const currentReserve = tokensInfo[index].reserves;

  const handleInputChange = (inputAmount: string) => {
    const inputAmountBN = prepareInputAmountAsBN(inputAmount);
    const lpValue = calculateLpValue(inputAmountBN, currentReserve, totalLpSupply);

    formikValues[LP_INPUT_KEY] = prepareFormikValue(lpValue);

    const calculatedValues = tokensInfo.map(({ reserves: calculatedReserve }, indexOfCalculatedInput) => {
      if (index === indexOfCalculatedInput) {
        return inputAmountBN;
      }

      return calculateOutputWithToken(lpValue, totalLpSupply, calculatedReserve);
    });

    calculatedValues.forEach((calculatedValue, indexOfCalculatedInput) => {
      formikValues[getInputSlugByIndex(indexOfCalculatedInput)] = prepareFormikValue(calculatedValue);
    });

    stableswapItemFormStore.setLpAndTokenInputAmounts(lpValue, calculatedValues);

    formik.setValues(formikValues);
  };

  return { inputSlug, label, value, error, token, decimals, shouldShowBalanceButtons, handleInputChange };
};
