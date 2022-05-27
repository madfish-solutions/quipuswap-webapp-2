import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { LP_INPUT_KEY } from '@config/constants';
import { TokenInput } from '@shared/components';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';

import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { useStableLpInputViewModel } from './stable-lp-input.vm';

interface Props {
  formik: IFormik<RemoveLiqFormValues>;
  label: string;
  balance?: string;
  className?: string;
  onInputChange: (value: string) => void;
}

export const StableLpInput: FC<Props> = observer(({ formik, label, balance, className, onInputChange }) => {
  const outputComponentViewModel = useStableLpInputViewModel(formik);

  if (isNull(outputComponentViewModel)) {
    return null;
  }

  const { value, error, lpToken, dollarEquivalent, hiddenPercentSelector } = outputComponentViewModel;

  return (
    <TokenInput
      className={className}
      tokens={lpToken}
      label={label}
      id={LP_INPUT_KEY}
      value={value}
      dollarEquivalent={dollarEquivalent}
      onInputChange={onInputChange}
      balance={balance}
      error={error}
      hiddenPercentSelector={hiddenPercentSelector}
    />
  );
});
