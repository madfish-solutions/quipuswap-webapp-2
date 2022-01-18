import React from 'react';

import { Nullable } from '@utils/types';

import { PresetsAmountInput } from '../PresetsAmountInput';

const deadlinePresets = [
  { label: '30m', value: '30' },
  { label: '1h', value: '60' },
  { label: '3h', value: '180' }
];

export interface TransactionDeadlineProps {
  className?: string;
  handleChange: (value: Nullable<string>) => void;
  placeholder?: string;
}

export const TransactionDeadline: React.FC<TransactionDeadlineProps> = ({
  className,
  handleChange,
  placeholder = 'CUSTOM'
}) => (
  <PresetsAmountInput
    className={className}
    decimals={2}
    defaultValue={deadlinePresets[0].value}
    min={0}
    handleChange={handleChange}
    placeholder={placeholder}
    presets={deadlinePresets}
    unit="m"
  />
);
