import { useAccountPkh } from '@providers/use-dapp';
import { useNewExchangeRates } from '@providers/use-new-exchange-rate';
import { getTokenSlug, isNull, multipliedIfPossible } from '@shared/helpers';
import { useTokensModalStore } from '@shared/modals/tokens-modal/use-tokens-modal-store';
import { IFormik, Undefined } from '@shared/types';

import { getInputSlugByIndex } from '../../../../../helpers';
import { useStableswapItemStore } from '../../../../../hooks';
import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';

// TODO: Remove this way getting exchangeRate, till it appears on BE (all vars with prefix - temp)

export const useStableTokenInputViewModel = (
  formik: IFormik<RemoveLiqFormValues>,
  index: number,
  isRemove: Undefined<boolean>
) => {
  const accountPkh = useAccountPkh();

  const tokensModalStore = useTokensModalStore();
  const choosedTokens = tokensModalStore.singleChoosenTokens;

  const tempExchangeRate = useNewExchangeRates();

  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  if (isNull(item)) {
    return null;
  }

  const tokenInputDTI = `tokenInputContainer-${index}`;

  const { tokensInfo } = item;

  const token = choosedTokens[index] ?? tokensInfo[index].token;
  // TODO: Add exchangeRates for choosedTokens[index], while it appears on BackEnd
  const tempChoosedTokenSlug = getTokenSlug(token);
  const tempChoosedTokenExchangeRate = tempExchangeRate[tempChoosedTokenSlug];

  const exchangeRate = tempChoosedTokenExchangeRate ?? tokensInfo[index].exchangeRate;

  const inputSlug = getInputSlugByIndex(index);
  const value = formik.values[inputSlug];
  const error = formik.errors[inputSlug];
  const hiddenPercentSelector = !Boolean(accountPkh) || isRemove;
  const dollarEquivalent = multipliedIfPossible(formik.values[inputSlug], exchangeRate.toFixed());

  return {
    inputSlug,
    value,
    error,
    token,
    hiddenPercentSelector,
    tokenInputDTI,
    dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent
  };
};
