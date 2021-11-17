import React from 'react';
import BigNumber from 'bignumber.js';

import { Button } from '@quipuswap/ui-kit';

import s from './ComplexInput.module.sass';

type PercentSelectorProps = {
  handleBalance: (state:string) => void,
  value: string,
};

export const PercentSelector: React.FC<PercentSelectorProps> = ({
  handleBalance,
  value,
}) => {
  const handle25 = () => handleBalance(new BigNumber(value).times(0.25).toFixed());
  const handle50 = () => handleBalance(new BigNumber(value).times(0.5).toFixed());
  const handle75 = () => handleBalance(new BigNumber(value).times(0.75).toFixed());
  const handleMAX = () => handleBalance(value);

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
