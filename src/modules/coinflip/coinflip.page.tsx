import { FC } from 'react';

import { PageTitle, TestnetAlert, DashboardStatsInfo } from '@shared/components';
import { DashboardCard } from '@shared/components/dashboard-stats-info/dashboard-card';

export const CoinflipPage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
      <DashboardStatsInfo
        cards={[
          <DashboardCard size="large" volume="1000" label="Bank" currency="QUIPU" />,
          <DashboardCard size="large" volume="1.99" label="Payout coefficient" currency="X" />,
          <DashboardCard size="large" volume="1000" label="Total wins" currency="QUIPU" />,
          <DashboardCard size="large" volume="123" label="Games count" />
        ]}
        countOfRightElements={1}
      />
    </>
  );
};
