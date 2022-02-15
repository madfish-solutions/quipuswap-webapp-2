import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, VotingReward } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import styles from './pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  pendingRewardAmount: string;
}

export const PendingRewards: FC<Props> = ({ pendingRewardAmount }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div>
        <span className={styles.title}>Your Pending Rewards</span>
        <StateCurrencyAmount className={styles.amount} amount={pendingRewardAmount} currency="$" isLeftCurrency />
      </div>
      <VotingReward /> {/* TODO: Rename */}
    </div>
  );
};
