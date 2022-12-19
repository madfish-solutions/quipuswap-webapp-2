import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useLiquidityV3PoolStatsViewModel } from '@modules/liquidity/hooks';
import { ListStats } from '@shared/components';

export const LiquidityV3PoolStats: FC = observer(() => {
  const { stats } = useLiquidityV3PoolStatsViewModel();

  return <ListStats stats={stats} slidesToShow={3} />;
});
