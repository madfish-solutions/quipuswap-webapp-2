import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import styles from './stake-status.module.scss';

export enum eStakeStatus {
  ACTIVE = 'ACTIVE',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  FAILED = 'FAILED',
  ACTIVATED = 'ACTIVATED',
  DISABLED = 'DISABLED',
  PAUSED = 'PAUSED'
}

const gradients = {
  [eStakeStatus.ACTIVE]: 'linear-gradient(98deg, #5C1EE0 0%, #1373E4 100%)',
  [eStakeStatus.APPROVED]: '#2ED33E',
  [eStakeStatus.PENDING]: 'linear-gradient(98deg, #FF6B00 0%, #F9A605 100%)',
  [eStakeStatus.FAILED]: '#EA2424',
  [eStakeStatus.ACTIVATED]: '#A1A4B1',
  [eStakeStatus.DISABLED]: '#A1A4B1',
  [eStakeStatus.PAUSED]: 'linear-gradient(98deg, #FF6B00 0%, #F9A605 100%)'
};

interface StakeStatusProps {
  status: eStakeStatus;
}

const themeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StakeStatus: FC<StakeStatusProps> = ({ status }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.container, themeClass[colorThemeMode])} style={{ background: gradients[status] }}>
      <span className={cx(styles.status)}>{status}</span>
    </div>
  );
};
