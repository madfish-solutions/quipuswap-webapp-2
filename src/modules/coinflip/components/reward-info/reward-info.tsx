import { FC, ReactNode } from 'react';

import { BigNumber } from 'bignumber.js';
import cx from 'classnames';

import { Button, Card, StateCurrencyAmount } from '@shared/components';
import { ArrowSign } from '@shared/svg';
import { Undefined } from '@shared/types';

import { CoinflipStatsItem } from '../coinflip-stats-item';
import { YourWinningsReward } from '../your-winnigs';
import styles from './reward-info.module.scss';
import { useRewardInfoViewModel } from './use-reward-info.vm';

interface Props {
  userReward: Nullable<BigNumber>;
  gamesCount: Nullable<BigNumber>;
  rewardTooltip: string;
  yourGamesTooltip: string;
  currency: string;
  isError: Undefined<boolean>;
  isNotEmptyArray: boolean;
  details?: ReactNode;
}

export const RewardInfo: FC<Props> = ({
  userReward,
  rewardTooltip,
  yourGamesTooltip,
  currency,
  gamesCount,
  isError,
  isNotEmptyArray,
  details
}) => {
  const { isDetailsOpen, toggle, transaction, isYourGamesVisible, isViewDetailsVisible } = useRewardInfoViewModel(
    gamesCount,
    details,
    isError,
    isNotEmptyArray
  );
  const { detailsButtonTransaction } = transaction;

  return (
    <Card
      contentClassName={styles.cardContent}
      footer={isDetailsOpen && details}
      className={styles.card}
      footerClassName={styles.footer}
    >
      <YourWinningsReward
        amount={userReward}
        gamesCount={gamesCount}
        isNotEmptyArray={isNotEmptyArray}
        rewardTooltip={rewardTooltip}
        currency={currency}
        className={styles.yourWinnigns}
      />
      <div className={styles.wrapper}>
        {isYourGamesVisible && (
          <CoinflipStatsItem itemName="Your Games" loading={!Boolean(gamesCount)} tooltipContent={yourGamesTooltip}>
            <StateCurrencyAmount amount={gamesCount} amountClassName={styles.amount} isError={!isError} />
          </CoinflipStatsItem>
        )}
        {isViewDetailsVisible && (
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
