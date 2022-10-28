import { FC } from 'react';

import { ListStats } from '@shared/components';

import { useListStatsViewModel } from './use-list-stats.vm';

export const LiquidityStats: FC = () => {
  const params = useListStatsViewModel();

  return <ListStats {...params} />;
};
