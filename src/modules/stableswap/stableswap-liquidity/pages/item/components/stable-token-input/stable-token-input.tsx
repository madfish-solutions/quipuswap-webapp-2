import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TokenInput } from '@shared/components';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';

import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { useStableTokenInputViewModel } from './stable-token-input.vm';

interface Props {
  index: number;
  formik: IFormik<RemoveLiqFormValues>;
  label: string;
  className?: string;
  balance?: string;
  onInputChange: (value: string) => void;
}

export const StableTokenInput: FC<Props> = observer(({ formik, index, label, balance, className, onInputChange }) => {
  const outputComponentViewModel = useStableTokenInputViewModel(formik, index);

  if (isNull(outputComponentViewModel)) {
    return null;
  }

  const { inputSlug, value, error, token, decimals, shouldShowBalanceButtons } = outputComponentViewModel;

  return (
    <TokenInput
      className={className}
      tokenA={token}
      label={label}
      id={inputSlug}
      value={value}
      onInputChange={onInputChange}
      balance={balance}
      decimals={decimals}
      error={error}
      shouldShowBalanceButtons={shouldShowBalanceButtons}
    />
  );
});
