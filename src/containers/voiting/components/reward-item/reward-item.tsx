import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, Nullable, VotingReward } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DashPlug } from '@components/ui/dash-plug';
import { useAccountPkh } from '@utils/dapp';
import { formatBalance, isExist, isNull } from '@utils/helpers';

import styles from './reward-item.module.scss';

export interface RewardItemProps {
  amount: Nullable<string>;
  description: string;
  currency: string;
}

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

const REWARD_DASH_ZOOM = 1.45;

export const RewardItem: FC<RewardItemProps> = ({ amount, description, currency }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);
  const accountPkh = useAccountPkh();

  const content =
    !isNull(accountPkh) && isExist(amount) && amount !== '' ? (
      formatBalance(amount)
    ) : (
      <DashPlug animation={Boolean(accountPkh)} zoom={REWARD_DASH_ZOOM} />
    );

  return (
    <div className={cx(modeClass[colorThemeMode], styles.reward)}>
      <div className={styles.rewardContent}>
        <span className={styles.rewardHeader}>{description}</span>
        <span className={styles.rewardAmount}>
          {content}
          <span className={styles.rewardCurrency}>{currency}</span>
        </span>
      </div>
      <VotingReward /> {/* TODO: Rename */}
    </div>
  );
};
