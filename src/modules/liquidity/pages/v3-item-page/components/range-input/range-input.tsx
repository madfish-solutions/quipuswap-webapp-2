import { FC } from 'react';

import { TokenInput } from '@shared/components';
import { Token } from '@shared/types';

import styles from './range-input.module.scss';

interface RangeInputProps {
  minPrice: string;
  maxPrice: string;
  minPriceChange: (value: string) => void;
  maxPriceChange: (value: string) => void;
  tokens: [Token, Token];
}

export const RangeInput: FC<RangeInputProps> = ({ minPrice, maxPrice, minPriceChange, maxPriceChange, tokens }) => {
  return (
    <div className={styles.root}>
      <TokenInput tokens={tokens} value={minPrice} label={'Min.Price'} onInputChange={minPriceChange} />
      <TokenInput tokens={tokens} value={maxPrice} label={'Max.Price'} onInputChange={maxPriceChange} />
    </div>
  );
};
