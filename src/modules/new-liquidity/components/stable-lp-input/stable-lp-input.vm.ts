import { FormikValues } from 'formik';

import { LP_INPUT_KEY } from '@config/constants';
import { QUIPU_TOKEN } from '@config/tokens';
import { useAccountPkh } from '@providers/use-dapp';
import { multipliedIfPossible } from '@shared/helpers';
import { IFormik } from '@shared/types';

export const useStableLpInputViewModel = (formik: IFormik<FormikValues>) => {
  const accountPkh = useAccountPkh();

  const lpTokenInputDTI = 'lpTokenInput';

  const value = formik.values[LP_INPUT_KEY];
  const error = formik.errors[LP_INPUT_KEY] as string;
  const hiddenPercentSelector = !Boolean(accountPkh);
  //TODO: Calculate lp exchangeRate on backend
  const dollarEquivalent = multipliedIfPossible(formik.values[LP_INPUT_KEY], null);

  return {
    value,
    error,
    lpToken: QUIPU_TOKEN,
    lpTokenInputDTI,
    dollarEquivalent: dollarEquivalent?.isNaN() ? null : dollarEquivalent,
    hiddenPercentSelector
  };
};
