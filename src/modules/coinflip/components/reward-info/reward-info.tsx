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
  hasTokensReward: boolean;
  details?: ReactNode;
}

export const RewardInfo: FC<Props> = ({
  userReward,
  rewardTooltip,
  yourGamesTooltip,
  currency,
  gamesCount,
  isError,
  hasTokensReward,
  details
}) => {
  const { isDetailsOpen, toggle, translation, isContentVisible } = useRewardInfoViewModel(
    gamesCount,
    details,
    isError,
    hasTokensReward
  );
  const { detailsButtonTransaction, yourGamesTranslation } = translation;
  const { isFooterVisible, isYourGamesVisible, isViewDetailsVisible } = isContentVisible;

  return (
    <Card
      contentClassName={styles.cardContent}
      footer={isFooterVisible}
      className={styles.card}
      footerClassName={styles.footer}
    >
      <YourWinningsReward
        amount={userReward}
        gamesCount={gamesCount}
        hasTokensReward={hasTokensReward}
        rewardTooltip={rewardTooltip}
        currency={currency}
        className={styles.yourWinnigns}
      />
      <div className={styles.wrapper}>
        {isYourGamesVisible && (
          <CoinflipStatsItem
            itemName={yourGamesTranslation}
            loading={!Boolean(gamesCount)}
            tooltipContent={yourGamesTooltip}
          >
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
