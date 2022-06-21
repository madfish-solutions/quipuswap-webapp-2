import { FC } from 'react';

import { MIN_SLIPPAGE_PERCENTAGE } from '@config/constants';
import { Nullable } from '@shared/types';

import { PresetsAmountInput } from '../presets-amount-input';

const liquiditySlippagePresets = [
  { label: '0 %', value: '0' },
  { label: '0.5 %', value: '0.5' },
  { label: '1 %', value: '1' }
];

const tradingSlippagePresets = [
  { label: '0.1 %', value: '0.1' },
  { label: '0.5 %', value: '0.5' },
  { label: '1 %', value: '1' }
];

export enum SlippageType {
  LIQUIDITY = 'LIQUIDITY',
  TRADING = 'TRADING'
}

const slippagePresets = {
  [SlippageType.LIQUIDITY]: liquiditySlippagePresets,
  [SlippageType.TRADING]: tradingSlippagePresets
};

interface Props {
  value: string;
  type: SlippageType;
  className?: string;
  handleChange: (value: Nullable<string>) => void;
  placeholder?: string;
}

export const SlippageInput: FC<Props> = ({ className, value, type, handleChange }) => {
  return (
    <PresetsAmountInput
      className={className}
      defaultValue={value}
      min={MIN_SLIPPAGE_PERCENTAGE}
      handleChange={handleChange}
      placeholder={value}
      presets={slippagePresets[type]}
      unit="%"
    />
  );
};
