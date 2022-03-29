import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { defined, isNull } from '@shared/helpers/type-checks';
import { formatIntegerWithDecimals } from '@shared/helpers/format-balance';
import { Nullable, Optional } from 'types/types';

import { Button } from '@shared/components/button';
import s from './complex-input.module.sass';

interface PercentSelectorProps {
  handleBalance?: (state: string) => void;
  value: Optional<string>;
  amountCap?: BigNumber;
}

const DEFAULT_INPUT_CAP = new BigNumber('0');
const MIN_SELECTABLE_VALUE = 0;

const multipliedByPercent = (value: Nullable<string>, percent: number) =>
  formatIntegerWithDecimals(new BigNumber(value || '0').times(percent).toFixed());

export const PercentSelector: FC<PercentSelectorProps> = ({ handleBalance, value, amountCap = DEFAULT_INPUT_CAP }) => {
  const handle25 = () => handleBalance?.(multipliedByPercent(defined(value), 0.25));
  const handle50 = () => handleBalance?.(multipliedByPercent(defined(value), 0.5));
  const handle75 = () => handleBalance?.(multipliedByPercent(defined(value), 0.75));
  const handleMAX = () =>
    handleBalance?.(BigNumber.maximum(new BigNumber(defined(value)).minus(amountCap), MIN_SELECTABLE_VALUE).toFixed());

  const disabled = isNull(value);

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
