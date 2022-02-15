import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, VotingReward } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { StateCurrencyAmount } from '@components/ui/state-components/state-currency-amount';

import styles from './user-pending-rewards.module.scss';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  amount: string;
}

export const UserPendingRewards: FC<Props> = ({ amount }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(styles.reward, modeClass[colorThemeMode])}>
      <div>
        <span className={styles.title}>Your Pending Rewards</span>
        <StateCurrencyAmount className={styles.amount} amount={amount} currency="$" isLeftCurrency />
      </div>
      <VotingReward /> {/* TODO: Rename */}
    </div>
  );
};
