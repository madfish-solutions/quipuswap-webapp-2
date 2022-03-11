import React from 'react';

import BigNumber from 'bignumber.js';

import { defined, formatIntegerWithDecimals } from '@utils/helpers';
import { Nullable } from '@utils/types';

import { Button } from '../elements/button';
import s from './ComplexInput.module.sass';

interface PercentSelectorProps {
  handleBalance?: (state: string) => void;
  value: Nullable<string>;
  amountCap?: BigNumber;
}

const DEFAULT_INPUT_CAP = new BigNumber('0');
const MIN_SELECTABLE_VALUE = 0;

const multipliedByPercent = (value: string, percent: number) =>
  formatIntegerWithDecimals(new BigNumber(value).times(percent).toFixed());

export const PercentSelector: React.FC<PercentSelectorProps> = ({
  handleBalance,
  value,
  amountCap = DEFAULT_INPUT_CAP
}) => {
  const handle25 = () => handleBalance?.(multipliedByPercent(defined(value), 0.25));
  const handle50 = () => handleBalance?.(multipliedByPercent(defined(value), 0.5));
  const handle75 = () => handleBalance?.(multipliedByPercent(defined(value), 0.75));
  const handleMAX = () =>
    handleBalance?.(BigNumber.maximum(new BigNumber(defined(value)).minus(amountCap), MIN_SELECTABLE_VALUE).toFixed());

  const disabled = value === null;

  return (
    <div className={s.controls}>
      <Button theme="inverse" disabled={disabled} onClick={handle25} className={s.btn}>
        25%
      </Button>
      <Button theme="inverse" disabled={disabled} onClick={handle50} className={s.btn}>
        50%
      </Button>
      <Button theme="inverse" disabled={disabled} onClick={handle75} className={s.btn}>
        75%
      </Button>
      <Button theme="inverse" disabled={disabled} onClick={handleMAX} className={s.btn}>
        MAX
      </Button>
    </div>
  );
};
