import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DashPlug } from '@components/ui/dash-plug';
import { useAuthStore } from '@hooks/stores/use-auth-store';
import { isNull } from '@utils/helpers';

import styles from './staking-stats-item.module.sass';

export interface StakingStatsItemProps {
  itemName: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

export const StakingStatsItem: FC<StakingStatsItemProps> = ({ itemName, children }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const { accountPkh } = useAuthStore();

  const content =
    isNull(accountPkh) || isNull(children) ? (
      <DashPlug animation={Boolean(accountPkh)} className={styles.dash} />
    ) : (
      children
    );

  return (
    <div className={cx(modeClass[colorThemeMode], styles.item)}>
      <span className={styles.header}>{itemName}:</span>
      <div className={styles.value}>{content}</div>
    </div>
  );
};
