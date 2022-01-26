import React, { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import s from './page-title.module.sass';

const modeClass = {
  [ColorModes.Light]: s.light,
  [ColorModes.Dark]: s.dark
};

interface PageTitleProps {
  className?: string;
}

export const PageTitle: FC<PageTitleProps> = ({ className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(s.pageTitle, modeClass[colorThemeMode], className);

  return <h1 className={compoundClassName}>{children}</h1>;
};
