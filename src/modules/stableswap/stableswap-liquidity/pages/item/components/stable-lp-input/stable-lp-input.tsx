import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TokenInput } from '@shared/components';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';

import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { LP_INPUT_KEY } from './constants';
import { useStableLpInputViewModel } from './stable-lp-input.vm';

interface Props {
  className?: string;
  formik: IFormik<RemoveLiqFormValues>;
  balance?: string;
}

export const StableLpInput: FC<Props> = observer(({ formik, balance, className }) => {
  const outputComponentViewModel = useStableLpInputViewModel(formik);

  if (isNull(outputComponentViewModel)) {
    return null;
  }

  const { label, value, error, lpToken, decimals, shouldShowBalanceButtons, handleLpInputChange } =
    outputComponentViewModel;

  return (
    <TokenInput
      className={className}
      tokenA={lpToken}
      label={label}
      id={LP_INPUT_KEY}
      value={value}
      onInputChange={handleLpInputChange}
      balance={balance}
      decimals={decimals}
      error={error}
      shouldShowBalanceButtons={shouldShowBalanceButtons}
    />
  );
});
