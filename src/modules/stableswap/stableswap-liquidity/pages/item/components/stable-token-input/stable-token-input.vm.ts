import { useAccountPkh } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';

import { getInputSlugByIndex } from '../../../../../helpers';
import { useStableswapItemStore } from '../../../../../hooks';
import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';

export const useStableTokenInputViewModel = (formik: IFormik<RemoveLiqFormValues>, index: number) => {
  const accountPkh = useAccountPkh();
  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  if (isNull(item)) {
    return null;
  }

  const { tokensInfo } = item;

  const token = tokensInfo[index].token;
  const { decimals } = token.metadata;

  const inputSlug = getInputSlugByIndex(index);
  const value = formik.values[inputSlug];
  const error = formik.errors[inputSlug];
  const hiddenPercentSelector = !Boolean(accountPkh);

  return { inputSlug, value, error, token, decimals, hiddenPercentSelector };
};
