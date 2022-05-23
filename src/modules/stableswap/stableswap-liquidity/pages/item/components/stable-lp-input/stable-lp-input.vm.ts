import { LP_INPUT_KEY } from '@config/constants';
import { useAccountPkh } from '@providers/use-dapp';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';

import { useStableswapItemStore } from '../../../../../hooks';
import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';

export const useStableLpInputViewModel = (formik: IFormik<RemoveLiqFormValues>) => {
  const accountPkh = useAccountPkh();
  const stableswapItemStore = useStableswapItemStore();
  const item = stableswapItemStore.item;

  if (isNull(item)) {
    return null;
  }

  const { lpToken } = item;

  const { decimals } = lpToken.metadata;

  const value = formik.values[LP_INPUT_KEY];
  const error = formik.errors[LP_INPUT_KEY];
  const hiddenPercentSelector = !Boolean(accountPkh);

  return { value, error, lpToken, decimals, hiddenPercentSelector };
};
