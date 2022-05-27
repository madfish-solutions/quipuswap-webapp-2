import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { DashboardCard, DashboardStatsInfo } from '@shared/components';

import styles from './coinflip-dashboard-stats.module.scss';
import { useCoinflipDashboardStatsViewModel } from './use-coinflip-dashboard-stats.vm';

interface Props {
  isLoading: boolean;
}

export const CoinflipDashboardStatsInfo: FC<Props> = observer(({ isLoading }) => {
  const { bank, gamesCount, payoutCoefficient, totalWins, tokenToPlay } = useCoinflipDashboardStatsViewModel();

  return (
    <DashboardStatsInfo
      header="Game Info"
      cards={[
        <DashboardCard
          size="large"
          volume={bank}
          label="Bank"
          currency={tokenToPlay}
          loading={isLoading}
          hideTooltip
          className={styles.dashboardCard}
        />,
        <DashboardCard
          size="large"
          volume={payoutCoefficient}
          label="Payout coefficient"
          currency="X"
          loading={isLoading}
          hideTooltip
          className={styles.dashboardCard}
        />,
        <DashboardCard
          size="large"
          volume={totalWins}
          label="Total wins"
          currency={tokenToPlay}
          loading={isLoading}
          hideTooltip
          className={styles.dashboardCard}
        />,
        <DashboardCard
          size="large"
          volume={gamesCount}
          label="Games count"
          loading={isLoading}
          hideTooltip
          className={styles.dashboardCard}
        />
      ]}
      countOfRightElements={1}
    />
  );
});
