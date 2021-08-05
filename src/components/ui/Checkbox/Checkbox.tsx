/* eslint-disable react/button-has-type */
import React, { useContext } from 'react';
import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/ColorThemeContext';
import { CheckboxIcon } from '@components/svg/CheckboxIcon';
import { Checkdone } from '@components/svg/Checkdone';

import s from './Checkbox.module.sass';
import { Button } from '../Button';

type CheckboxProps = {
  external?: boolean
  className?: string
} & (
  | React.HTMLProps<HTMLInputElement>
);

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark,
};

export const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked,
  ...props
}) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(
    s.root,
    modeClass[colorThemeMode],
    className,
  );

  return (
    <Button
      // @ts-ignore
      className={compoundClassName}
      theme="quaternary"
    >
      {!checked ? <CheckboxIcon /> : <Checkdone />}
      <input hidden type="checkbox" {...props} />
    </Button>
  );
};
