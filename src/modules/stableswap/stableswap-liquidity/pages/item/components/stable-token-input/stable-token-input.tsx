import { FC } from 'react';

import { BigNumber } from 'bignumber.js';
import { observer } from 'mobx-react-lite';

import { TokenInput } from '@shared/components';
import { isNull } from '@shared/helpers';
import { IFormik, Optional } from '@shared/types';

import { RemoveLiqFormValues } from '../forms/remove-liq-form/use-remove-liq-form.vm';
import { useStableTokenInputViewModel } from './stable-token-input.vm';

interface Props {
  index: number;
  formik: IFormik<RemoveLiqFormValues>;
  label: string;
  className?: string;
  balance?: Optional<BigNumber.Value>;
  isRemove?: boolean;
  onInputChange: (value: string) => void;
}

export const StableTokenInput: FC<Props> = observer(
  ({ formik, index, label, balance, className, isRemove, onInputChange }) => {
    const outputComponentViewModel = useStableTokenInputViewModel(formik, index, isRemove);

    if (isNull(outputComponentViewModel)) {
      return null;
    }

    const { inputSlug, value, error, token, hiddenPercentSelector, dollarEquivalent } = outputComponentViewModel;

    return (
      <TokenInput
        className={className}
        tokens={token}
        decimals={token.metadata.decimals}
        label={label}
        id={inputSlug}
        value={value}
        dollarEquivalent={dollarEquivalent}
        onInputChange={onInputChange}
        balance={balance}
        error={error}
        hiddenPercentSelector={hiddenPercentSelector}
      />
    );
  }
);
