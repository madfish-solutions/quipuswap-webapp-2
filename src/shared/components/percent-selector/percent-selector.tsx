import { FC } from 'react';

import BigNumber from 'bignumber.js';

import { defined, formatIntegerWithDecimals, isNull } from '@shared/helpers';
import { Nullable, Optional } from '@shared/types';

import { Button } from '../button';
import styles from './percent-selector.module.scss';

interface PercentSelectorProps {
  handleBalance?: (state: string) => void;
  value: Optional<BigNumber.Value>;
  amountCap?: BigNumber;
  decimals?: number;
}

const DEFAULT_INPUT_CAP = new BigNumber('0');
const MIN_SELECTABLE_VALUE = 0;

const multipliedByPercent = (value: Nullable<BigNumber.Value>, percent: number, decimals?: number) =>
  decimals
    ? formatIntegerWithDecimals(new BigNumber(value || '0').times(percent).toFixed(decimals, BigNumber.ROUND_DOWN))
    : formatIntegerWithDecimals(new BigNumber(value || '0').times(percent).toFixed());

//TODO: Remove value, make function (coefficient) => calulate(coefficient)
export const PercentSelector: FC<PercentSelectorProps> = ({
  handleBalance,
  value,
  amountCap = DEFAULT_INPUT_CAP,
  decimals
}) => {
  const handle25 = () => handleBalance?.(multipliedByPercent(defined(value), 0.25, decimals));
  const handle50 = () => handleBalance?.(multipliedByPercent(defined(value), 0.5, decimals));
  const handle75 = () => handleBalance?.(multipliedByPercent(defined(value), 0.75, decimals));
  const handleMAX = () =>
    handleBalance?.(BigNumber.maximum(new BigNumber(defined(value)).minus(amountCap), MIN_SELECTABLE_VALUE).toFixed());

  const disabled = isNull(value);

  return (
    <div className={styles.controls}>
      <Button theme="inverse" disabled={disabled} onClick={handle25} className={styles.btn} data-test-id="25percent">
        25%
      </Button>
      <Button theme="inverse" disabled={disabled} onClick={handle50} className={styles.btn} data-test-id="50percent">
        50%
      </Button>
      <Button theme="inverse" disabled={disabled} onClick={handle75} className={styles.btn} data-test-id="75percent">
        75%
      </Button>
      <Button theme="inverse" disabled={disabled} onClick={handleMAX} className={styles.btn} data-test-id="100percent">
        MAX
      </Button>
    </div>
  );
};
