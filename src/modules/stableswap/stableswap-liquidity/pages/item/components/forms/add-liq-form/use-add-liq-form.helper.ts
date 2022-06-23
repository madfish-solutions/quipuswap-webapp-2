import { hasFormikError, isEmptyArray } from '@shared/helpers';
import { IFormik } from '@shared/types';
import { useTranslation } from '@translation';

import { useZeroInputsError } from './use-zero-inputs-error';

export const useAddLiqFormHelper = (formik: IFormik) => {
  const { t } = useTranslation();

  const label = t('common|Input');
  const tooltip = t('stableswap|coinsBalancedProportion');
  const isSubmitting = formik.isSubmitting;
  const isZeroInputsError = useZeroInputsError();
  const shouldShowZeroInputsAlert = isZeroInputsError && !isEmptyArray(Object.entries(formik.touched));

  const disabled = shouldShowZeroInputsAlert || isSubmitting || hasFormikError(formik.errors);

  return {
    label,
    tooltip,
    disabled,
    isSubmitting,
    shouldShowZeroInputsAlert
  };
};
