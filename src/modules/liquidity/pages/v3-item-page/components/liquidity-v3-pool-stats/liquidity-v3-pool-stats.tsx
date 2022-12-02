import { FC } from 'react';

import { useLiquidityV3PoolStats } from '@modules/liquidity/hooks';
import { ListStats } from '@shared/components';

export const LiquidityV3PoolStats: FC = () => {
  const { stats } = useLiquidityV3PoolStats();

  return <ListStats stats={stats} slidesToShow={3} />;
};
