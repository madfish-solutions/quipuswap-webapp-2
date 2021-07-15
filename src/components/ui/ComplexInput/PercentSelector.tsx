import React, { } from 'react';
import { Button } from '../Button';

import s from './ComplexInput.module.sass';

type PercentSelectorProps = {
  onChange: (state:string) => void,
  value: string,
};

export const PercentSelector: React.FC<PercentSelectorProps> = ({
  onChange,
  value,
}) => {
  const handle25 = () => onChange!! && onChange((parseFloat(value) * 0.25).toString());
  const handle50 = () => onChange!! && onChange((parseFloat(value) * 0.5).toString());
  const handle75 = () => onChange!! && onChange((parseFloat(value) * 0.75).toString());
  const handleMAX = () => onChange!! && onChange(value);

  return (
    <div className={s.controls}>
      <Button theme="quaternary" onClick={handle25} className={s.btn}>25%</Button>
      <Button theme="quaternary" onClick={handle50} className={s.btn}>50%</Button>
      <Button theme="quaternary" onClick={handle75} className={s.btn}>75%</Button>
      <Button theme="quaternary" onClick={handleMAX} className={s.btn}>MAX</Button>

    </div>
  );
};
