import { FC, FormEvent } from 'react';

import { Input } from '@shared/components';
import { isNull } from '@shared/helpers';
import { Token } from '@shared/types';

import styles from './range-input.module.scss';

interface RangeInputProps {
  minPrice: number;
  maxPrice: number;
  minPriceChange: (value: number) => void;
  maxPriceChange: (value: number) => void;
  tokens: [Token, Token];
}

export const RangeInput: FC<RangeInputProps> = ({ minPrice, maxPrice, minPriceChange, maxPriceChange, tokens }) => {
  const handleMinPriceChange = (event: FormEvent<HTMLInputElement>) => {
    if (isNull(event) || isNull(event.target)) {
      return;
    }
    minPriceChange(Number((event.target as HTMLInputElement).value));
  };

  const handleMaxPriceChange = (event: FormEvent<HTMLInputElement>) => {
    if (isNull(event) || isNull(event.target)) {
      return;
    }
    maxPriceChange(Number((event.target as HTMLInputElement).value));
  };

  return (
    <div className={styles.root}>
      <Input type="number" value={minPrice} onChange={handleMinPriceChange} />
      <div>
        <Input type="number" value={maxPrice} onChange={handleMaxPriceChange} />
      </div>
    </div>
  );
};
