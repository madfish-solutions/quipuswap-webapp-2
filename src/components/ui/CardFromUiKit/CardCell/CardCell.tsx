import { FC, ReactNode, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './CardCell.module.sass';

interface CardCellProps {
  header?: ReactNode;
  className?: string;
}

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

export const CardCell: FC<CardCellProps> = ({ header, className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(className, s.root, modeClass[colorThemeMode])}>
      <h6 className={s.header}>{header}</h6>
      {children}
    </div>
  );
};
