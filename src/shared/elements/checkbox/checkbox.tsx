import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { CheckboxIcon, Checkdone } from '@shared/svg';

import s from './checkbox.module.sass';

export type CheckboxProps = {
  external?: boolean;
  className?: string;
} & React.HTMLProps<HTMLInputElement>;

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const Checkbox: React.FC<CheckboxProps> = ({ className, checked, ...props }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.root, modeClass[colorThemeMode], className);

  return (
    <div className={compoundClassName}>
      {!checked ? <CheckboxIcon /> : <Checkdone />}
      <input hidden type="checkbox" {...props} />
    </div>
  );
};
