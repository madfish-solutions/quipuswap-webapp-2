import { FC } from 'react';

import { Nullable } from '@shared/types';

import { PresetsAmountInput } from '../presets-amount-input';

const slippagePresets = [
  { label: '0.5 %', value: '0.5' },
  { label: '1 %', value: '1' },
  { label: '3 %', value: '3' }
];

interface Props {
  className?: string;
  handleChange: (value: Nullable<string>) => void;
  placeholder?: string;
}

export const Slippage: FC<Props> = ({ className, handleChange, placeholder = 'CUSTOM' }) => (
  <PresetsAmountInput
    className={className}
    defaultValue={slippagePresets[0].value}
    min={0}
    handleChange={handleChange}
    placeholder={placeholder}
    presets={slippagePresets}
    unit="%"
  />
);
