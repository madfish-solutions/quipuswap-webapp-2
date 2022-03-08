import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StakingStatus } from '@interfaces/staking.interfaces';

import styles from './stake-status.module.scss';

const gradients = {
  [StakingStatus.ACTIVE]: 'linear-gradient(98deg, #5C1EE0 0%, #1373E4 100%)',
  // [StakeStatus.APPROVED]: '#2ED33E',
  [StakingStatus.PENDING]: 'linear-gradient(98deg, #FF6B00 0%, #F9A605 100%)',
  // [StakeStatus.FAILED]: '#EA2424',
  // [StakeStatus.ACTIVATED]: '#A1A4B1',
  [StakingStatus.DISABLED]: '#A1A4B1',
  [StakingStatus.FINISHED]: '#A1A4B1'
  // [StakeStatus.PAUSED]: 'linear-gradient(98deg, #FF6B00 0%, #F9A605 100%)'
};

interface Props {
  status: StakingStatus;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StakeStatusBox: FC<Props> = ({ status }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.container, themeClass[colorThemeMode])} style={{ background: gradients[status] }}>
      <span className={cx(styles.status)}>{status}</span>
    </div>
  );
};
