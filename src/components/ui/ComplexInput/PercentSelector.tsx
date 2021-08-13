import React from 'react';

import { Button } from '@components/ui/Button';

import s from './ComplexInput.module.sass';

type PercentSelectorProps = {
  handleBalance: (state:string) => void,
  value: string,
};

export const PercentSelector: React.FC<PercentSelectorProps> = ({
  handleBalance,
  value,
}) => {
  const handle25 = () => handleBalance((parseFloat(value) * 0.25).toString());
  const handle50 = () => handleBalance((parseFloat(value) * 0.5).toString());
  const handle75 = () => handleBalance((parseFloat(value) * 0.75).toString());
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
