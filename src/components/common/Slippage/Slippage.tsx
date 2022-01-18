import React from 'react';

import { Nullable } from '@utils/types';

import { PresetsAmountInput } from '../PresetsAmountInput';

const slippagePresets = [
  { label: '0.5 %', value: '0.5' },
  { label: '1 %', value: '1' },
  { label: '3 %', value: '3' }
];

export interface SlippageProps {
  className?: string;
  handleChange: (value: Nullable<string>) => void;
  placeholder?: string;
}

export const Slippage: React.FC<SlippageProps> = ({ className, handleChange, placeholder = 'CUSTOM' }) => (
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
