import { FC, HTMLProps, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CheckboxIcon, Checkdone } from '@shared/svg';

import s from './checkbox.module.scss';

export type CheckboxProps = {
  external?: boolean;
  className?: string;
} & HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Checkbox: FC<CheckboxProps> = ({ className, checked, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.root, modeClass[colorThemeMode], className);

  return (
    <div className={compoundClassName} data-test-id="checkbox">
      {!checked ? <CheckboxIcon /> : <Checkdone />}
      <input hidden type="checkbox" {...props} />
    </div>
  );
};
