import React, { useCallback } from 'react';
import BigNumber from 'bignumber.js';

import { parseDecimals } from '@utils/helpers';
import { Button } from '@components/ui/Button';

import s from './ComplexInput.module.sass';

type PercentSelectorProps = {
  handleBalance: (state: string) => void;
  decimals?: number;
  value: string;
};

export const PercentSelector: React.FC<PercentSelectorProps> = ({
  handleBalance,
  decimals = 0,
  value,
}) => {
  const handleRatio = useCallback(
    (ratio: BigNumber.Value) =>
      handleBalance(
        parseDecimals(new BigNumber(value).times(ratio).toFixed(), 0, Infinity, decimals),
      ),
    [value, decimals, handleBalance],
  );

  return (
    <div className={s.controls}>
      <Button
        theme="inverse"
        onClick={() => handleRatio(new BigNumber(1).dividedBy(4))}
        className={s.btn}
      >
        25%
      </Button>
      <Button
        theme="inverse"
        onClick={() => handleRatio(new BigNumber(2).dividedBy(4))}
        className={s.btn}
      >
        50%
      </Button>
      <Button
        theme="inverse"
        onClick={() => handleRatio(new BigNumber(3).dividedBy(4))}
        className={s.btn}
      >
        75%
      </Button>
      <Button
        theme="inverse"
        onClick={() => handleRatio(new BigNumber(4).dividedBy(4))}
        className={s.btn}
      >
        MAX
      </Button>
    </div>
  );
};
