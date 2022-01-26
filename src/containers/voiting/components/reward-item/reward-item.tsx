import { FC, useContext } from 'react';

import { ColorModes, ColorThemeContext, Nullable, VotingReward } from '@quipuswap/ui-kit';
import cx from 'classnames';

import { DashPlug } from '@components/ui/dash-plug';
import { FormatNumber } from '@utils/formatNumber';
import { isExist } from '@utils/helpers';

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

export const RewardItem: FC<RewardItemProps> = ({ amount, description, currency }) => {
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <div className={cx(modeClass[colorThemeMode], styles.reward)}>
      <div className={styles.rewardContent}>
        <span className={styles.rewardHeader}>{description}</span>
        <span className={styles.rewardAmount}>
          {isExist(amount) && amount !== '' ? FormatNumber(amount) : <DashPlug zoom={1.45} />}
          <span className={styles.rewardCurrency}>{currency}</span>
        </span>
      </div>
      <VotingReward /> {/* TODO: Rename */}
    </div>
  );
};
