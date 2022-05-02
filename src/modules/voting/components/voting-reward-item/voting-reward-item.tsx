import { FC, useContext } from 'react';

import cx from 'classnames';

import { VotingReward } from '@modules/voting/components/voting-reward';
import { ColorModes, ColorThemeContext } from '@providers/color-theme-context';
import { useAccountPkh } from '@providers/use-dapp';
import { DashPlug } from '@shared/components';
import { formatBalance, isExist, isNull } from '@shared/helpers';
import { Nullable } from '@shared/types';

import styles from './voting-reward-item.module.scss';

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

export const VotingRewardItem: FC<RewardItemProps> = ({ amount, description, currency }) => {
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
        <span className={styles.rewardHeader} data-test-id="description">
          {description}
        </span>
        <span className={styles.rewardAmount}>
          <span data-test-id="amount">{content}</span>
          <span className={styles.rewardCurrency} data-test-id="currency">
            {currency}
          </span>
        </span>
      </div>
      <VotingReward /> {/* TODO: Rename */}
    </div>
  );
};
