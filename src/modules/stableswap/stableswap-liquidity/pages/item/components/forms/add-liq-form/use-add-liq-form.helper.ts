import { ZERO_AMOUNT } from '@config/constants';
import { hasFormikError, isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';
import { useTranslation } from '@translation';

import { useStableswapItemFormStore } from '../../../../../../hooks';

export const useAddLiqFormHelper = (formik: IFormik) => {
  const { t } = useTranslation();
  const formStore = useStableswapItemFormStore();

  const label = t('common|Input');
  const tooltip = t('stableswap|coinsBalancedProportion');
  const isSubmitting = formik.isSubmitting;
  const isAllInputsNonNegativeOnInbalancedLiquidity =
    !formStore.isBalancedProportion &&
    formik.dirty &&
    !formStore.inputAmounts.some(value => !isNull(value) && value.gt(ZERO_AMOUNT));

  const disabled = isAllInputsNonNegativeOnInbalancedLiquidity || isSubmitting || hasFormikError(formik.errors);

  return {
    label,
    tooltip,
    disabled,
    isSubmitting,
    isAllInputsNonNegativeOnInbalancedLiquidity
  };
};
