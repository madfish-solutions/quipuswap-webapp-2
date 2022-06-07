import { FC, useContext, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { ColorThemeContext, ColorModes } from '@providers/color-theme-context';
import { Button, Card, StateCurrencyAmount, Tooltip } from '@shared/components';
import { ArrowSign } from '@shared/svg';

import { YourWinningsReward } from '../your-winnigs';
import styles from './reward-info.module.scss';
import { useRewardInfoViewModel } from './use-reward-info.vm';

const modeClass = {
  [ColorModes.Light]: styles.light,
  [ColorModes.Dark]: styles.dark
};

interface Props {
  userReward: Nullable<BigNumber>;
  gamesCount: Nullable<BigNumber>;
  rewardTooltip: string;
  yourGamesTooltip: string;
  currency: string;
  isLoading: boolean;
  details?: ReactNode;
}

export const RewardInfo: FC<Props> = ({
  userReward,
  rewardTooltip,
  yourGamesTooltip,
  currency,
  gamesCount,
  isLoading,
  details
}) => {
  const { isDetailsOpen, toggle, transaction, showDetails } = useRewardInfoViewModel();
  const { detailsButtonTransaction } = transaction;
  const { colorThemeMode } = useContext(ColorThemeContext);

  return (
    <Card contentClassName={styles.cardContent} footer={isDetailsOpen && details} className={styles.card}>
      <YourWinningsReward
        amount={userReward}
        rewardTooltip={rewardTooltip}
        currency={currency}
        isLoading={isLoading}
        className={styles.yourWinnigns}
      />
      <div className={styles.wrapper}>
        <div className={styles.yourGamesStats}>
          <div className={styles.label}>
            <span>Your Games</span>
            <Tooltip content={yourGamesTooltip} />
          </div>
          <div className={cx(styles.amount, modeClass[colorThemeMode])}>
            <StateCurrencyAmount amount={gamesCount} isLoading={isLoading} />
          </div>
        </div>
        {details && showDetails && (
          <Button
            className={cx(styles.viewDetailsButton)}
            theme="inverse"
            icon={<ArrowSign rotation={isDetailsOpen} />}
            onClick={toggle}
          >
            {detailsButtonTransaction}
          </Button>
        )}
      </div>
    </Card>
  );
};
