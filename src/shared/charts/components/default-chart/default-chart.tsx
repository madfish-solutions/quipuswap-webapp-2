import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { DownOfDefaultChart, UpOfDefaultChart } from '@shared/svg';
import { useTranslation } from '@translation';

import styles from './default-chart.module.scss';

const colorModes = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const DefaultChart = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { t } = useTranslation();

  return (
    <div className={styles.root}>
      <UpOfDefaultChart className={styles.upDefaultOfChart} />
      <span className={cx(styles.text, colorModes[colorThemeMode])}>{t('liquidity|defaultChartText')}</span>
      <DownOfDefaultChart className={styles.bottomDefaultOfChart} />
    </div>
  );
};
