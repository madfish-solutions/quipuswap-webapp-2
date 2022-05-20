import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { TokenInput } from '@shared/components';
import { isNull } from '@shared/helpers';
import { IFormik } from '@shared/types';

import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { useStableTokenInputViewModel } from './stable-token-input.vm';

interface Props {
  className?: string;
  index: number;
  formik: IFormik<RemoveLiqFormValues>;
  balance?: string;
}

export const StableTokenInput: FC<Props> = observer(({ formik, index, balance, className }) => {
  const outputComponentViewModel = useStableTokenInputViewModel(formik, index);

  if (isNull(outputComponentViewModel)) {
    return null;
  }

  const { inputSlug, label, value, error, token, decimals, shouldShowBalanceButtons, handleInputChange } =
    outputComponentViewModel;

  return (
    <TokenInput
      className={className}
      tokenA={token}
      label={label}
      id={inputSlug}
      value={value}
      onInputChange={handleInputChange}
      balance={balance}
      decimals={decimals}
      error={error}
      shouldShowBalanceButtons={shouldShowBalanceButtons}
    />
  );
});
