import { FC } from 'react';

import { MIN_SLIPPAGE_PERCENTAGE } from '@config/constants';
import { Nullable } from '@shared/types';

import { PresetsAmountInput } from '../presets-amount-input';

const slippagePresets = [
  { label: '0.5 %', value: '0.5' },
  { label: '1 %', value: '1' },
  { label: '3 %', value: '3' }
];

interface Props {
  value: string;
  className?: string;
  handleChange: (value: Nullable<string>) => void;
  placeholder?: string;
}

export const SlippageInput: FC<Props> = ({ className, value, handleChange }) => {
  return (
    <PresetsAmountInput
      className={className}
      defaultValue={value}
      min={MIN_SLIPPAGE_PERCENTAGE}
      handleChange={handleChange}
      placeholder={value}
      presets={slippagePresets}
      unit="%"
    />
  );
};
