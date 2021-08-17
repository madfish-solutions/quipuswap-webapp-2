import React, { useContext, ReactNode } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { RadioSelected } from '@components/svg/RadioSelected';
import RadioUnselected from '@icons/RadioUnselected.svg';

import s from './Radio.module.sass';
import { Button } from '../Button';

export type RadioProps = {
  disabled?: boolean
  active: boolean
  className?: string
  label?: string
  icon?: ReactNode
  inputClassName?: string
  onClick?: () => void
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Radio: React.FC<RadioProps> = ({
  disabled = false,
  className,
  label,
  icon,
  active,
  onClick,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    { [s.disabled]: disabled },
    { [s.active]: active },
    modeClass[colorThemeMode],
    className,
  );

  return (
    <div className={compoundClassName}>
      <div className={s.input}>
        <Button onClick={onClick} theme="quaternary" className={s.radioButton}>
          {active
            ? <RadioSelected className={s.clickable} />
            : <RadioUnselected className={s.clickable} />}
          <span className={s.label}>
            {label}
          </span>
        </Button>
      </div>
      {icon}
    </div>
  );
};
