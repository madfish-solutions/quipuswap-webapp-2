import { useContext } from 'react';

import cx from 'classnames';

import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';

import styles from './next-rewards-timer.module.scss';
import { getNextRewardsTimestamp } from '../../helpers';
import { Countdown } from '../countdown';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const NextRewardsTimer = () => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.root, modeClass[colorThemeMode])}>
      <span className={styles.description}>Next rewards distributed in:</span>
      <Countdown
        endTimestamp={getNextRewardsTimestamp()}
        amountClassName={styles.amountClassName}
        periodClassName={styles.periodClassName}
        shouldShowSeconds
      />
    </div>
  );
};
