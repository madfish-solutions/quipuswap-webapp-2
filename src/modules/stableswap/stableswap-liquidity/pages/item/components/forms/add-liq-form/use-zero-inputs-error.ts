import { FormikValues } from 'formik';

import { ZERO_AMOUNT } from '@config/constants';
import { useStableswapItemFormStore } from '@modules/stableswap/hooks';
import { isNull } from '@shared/helpers';

export const useZeroInputsError = () => {
  const formStore = useStableswapItemFormStore();

  const isZeroInputsError = (inputAmounts: FormikValues) => {
    const entries = Object.entries(inputAmounts);

    return !formStore.isBalancedProportion && entries.every(([_, value]) => isNull(value) || !value.gt(ZERO_AMOUNT));
  };

  return { isZeroInputsError };
};
