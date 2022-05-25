import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useCoinflipStore } from '@modules/coinflip/hooks';
import { DashboardCard, DashboardStatsInfo } from '@shared/components';

import styles from './coinflip-dashboard-stats.module.scss';
import { useCoinflipDashboardStatsViewModel } from './use-coinflip-dashboard-stats.vm';

export const CoinflipDashboardStatsInfo: FC = observer(() => {
  const coinflipStore = useCoinflipStore();
  const { token } = coinflipStore;
  const { generalStats, isLoading, currency } = useCoinflipDashboardStatsViewModel(token);
  const { bank, gamesCount, payoutCoefficient, totalWins } = generalStats;

  return (
    <DashboardStatsInfo
      header="Game Info"
      cards={[
        <DashboardCard
          size="large"
          volume={bank}
          label="Bank"
          currency={currency}
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
          currency={currency}
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
