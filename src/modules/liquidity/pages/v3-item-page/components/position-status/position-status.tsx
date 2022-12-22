import { FC, useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useTranslation } from '@translation';

import styles from './position-status.module.scss';

interface Props {
  isInRange: boolean;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const PositionStatus: FC<Props> = ({ isInRange }) => {
  const { t } = useTranslation();
  const { colorThemeMode } = useContext(ColorThemeContext);
  const statusText = isInRange ? t('liquidity|inRange') : t('liquidity|notActive');

  return (
    <div className={styles.root}>
      <span className={cx(styles.statusText, modeClass[colorThemeMode])}>{statusText}</span>
      <div className={cx(styles.circle, { [styles.inRange]: isInRange })} />
    </div>
  );
};
