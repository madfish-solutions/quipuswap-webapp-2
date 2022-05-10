import { FC } from 'react';

import { DashboardCard } from '@modules/home/components/dex-dashboard/dashboard-card';
import { PageTitle, TestnetAlert, DashboardStatsInfo } from '@shared/components';

export const CoinflipPage: FC = () => {
  return (
    <>
      <TestnetAlert />
      <PageTitle>Game</PageTitle>
      <DashboardStatsInfo
        cards={[
          <DashboardCard size="large" volume="1" tooltip="hello" label="hi" currency="$" data-test-id="TVL" />,
          <DashboardCard size="large" volume="2" tooltip="hello" label="hi" currency="$" data-test-id="TVL" />,
          <DashboardCard size="large" volume="3" tooltip="hello" label="hi" currency="$" data-test-id="TVL" />,
          <DashboardCard size="large" volume="4" tooltip="hello" label="hi" currency="$" data-test-id="TVL" />
        ]}
        mobileRight={[2]}
      />
    </>
  );
};
