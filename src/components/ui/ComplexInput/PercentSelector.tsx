import React from 'react';

import { Button } from '@quipuswap/ui-kit';
import BigNumber from 'bignumber.js';

import { Nullable } from '@utils/types';

import s from './ComplexInput.module.sass';

interface PercentSelectorProps {
  handleBalance: (state: string) => void;
  value: Nullable<string>;
}

export const PercentSelector: React.FC<PercentSelectorProps> = ({ handleBalance, value }) => {
  const handle25 = () => handleBalance(new BigNumber(value!).times(0.25).toFixed());
  const handle50 = () => handleBalance(new BigNumber(value!).times(0.5).toFixed());
  const handle75 = () => handleBalance(new BigNumber(value!).times(0.75).toFixed());
  const handleMAX = () => handleBalance(value!);

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
