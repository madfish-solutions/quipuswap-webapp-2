import React, { useContext } from 'react';
import cx from 'classnames';
import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';

import { Shevron } from '@components/svg/Shevron';
import Token from '@icons/Token.svg';

import { Button } from '../Button';

import s from './ComplexInput.module.sass';

type ComplexBakerProps = {
  className?: string,
  label?:string,
  error?:string,
  id?:string
};

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const ComplexBaker: React.FC<ComplexBakerProps> = ({
  className,
  label,
  id,
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    modeClass[colorThemeMode],
    className,
  );

  return (
    <div
      className={compoundClassName}
    >
      {label && (
        <label htmlFor={id} className={s.label}>
          {label}
        </label>
      )}
      <div className={s.background}>

        <div className={s.shape}>
          <Button theme="quaternary" className={s.baker}>
            <Token />
            <h6 className={cx(s.token)}>
              BAKER NAME
            </h6>
            <Shevron />
          </Button>
        </div>
      </div>
    </div>
  );
};
