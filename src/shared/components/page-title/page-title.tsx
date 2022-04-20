import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './page-title.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface PageTitleProps {
  className?: string;
}

export const PageTitle: FC<PageTitleProps> = ({ className, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  const compoundClassName = cx(styles.pageTitle, modeClass[colorThemeMode], className);

  return (
    <h1 className={compoundClassName} data-test-id="title">
      {children}
    </h1>
  );
};
