import React from 'react';
import BigNumber from 'bignumber.js';

import { parseDecimals } from '@utils/helpers';
import { Button } from '@components/ui/Button';

import s from './ComplexInput.module.sass';

type PercentSelectorProps = {
  handleBalance: (state:string) => void,
  decimals?: number
  value: string,
};

export const PercentSelector: React.FC<PercentSelectorProps> = ({
  handleBalance,
  decimals = 0,
  value,
}) => {
  const handle25 = () => handleBalance(parseDecimals(
    new BigNumber(value).multipliedBy(0.25).toString(),
    0,
    Infinity,
    decimals,
  ));
  const handle50 = () => handleBalance(parseDecimals(
    new BigNumber(value).multipliedBy(0.5).toString(),
    0,
    Infinity,
    decimals,
  ));
  const handle75 = () => handleBalance(parseDecimals(
    new BigNumber(value).multipliedBy(0.75).toString(),
    0,
    Infinity,
    decimals,
  ));
  const handleMAX = () => handleBalance(parseDecimals(
    new BigNumber(value).multipliedBy(1).toString(),
    0,
    Infinity,
    decimals,
  ));

  return (
    <div className={s.controls}>
      <Button
        theme="inverse"
        onClick={handle25}
        className={s.btn}
      >
        25%
      </Button>
      <Button
        theme="inverse"
        onClick={handle50}
        className={s.btn}
      >
        50%
      </Button>
      <Button
        theme="inverse"
        onClick={handle75}
        className={s.btn}
      >
        75%
      </Button>
      <Button
        theme="inverse"
        onClick={handleMAX}
        className={s.btn}
      >
        MAX
      </Button>
    </div>
  );
};
