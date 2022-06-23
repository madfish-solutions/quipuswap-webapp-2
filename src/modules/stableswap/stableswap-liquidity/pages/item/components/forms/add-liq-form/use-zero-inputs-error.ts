import { ZERO_AMOUNT } from '@config/constants';
import { useStableswapItemFormStore } from '@modules/stableswap/hooks';
import { isNull } from '@shared/helpers';

export const useZeroInputsError = () => {
  const formStore = useStableswapItemFormStore();

  return (
    !formStore.isBalancedProportion && formStore.inputAmounts.every(value => isNull(value) || !value.gt(ZERO_AMOUNT))
  );
};
