import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DownOfDefaultChart, UpOfDefaultChart } from '@shared/svg';

import styles from './default-chart.module.scss';

const DEFAULT_TEXT = 'Oops... Imagine a beautiful chart with pool reserves while we handle the issue.';

const colorModes = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DefaultChart = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={styles.root}>
      <UpOfDefaultChart className={styles.upDefaultOfChart} />
      <span className={cx(styles.text, colorModes[colorThemeMode])}>{DEFAULT_TEXT}</span>
      <DownOfDefaultChart className={styles.bottomDefaultOfChart} />
    </div>
  );
};
