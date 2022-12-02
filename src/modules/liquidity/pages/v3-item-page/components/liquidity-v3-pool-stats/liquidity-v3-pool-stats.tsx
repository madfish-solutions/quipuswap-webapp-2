import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { useLiquidityV3PoolStats } from '@modules/liquidity/hooks';
import { ListStats } from '@shared/components';

export const LiquidityV3PoolStats: FC = observer(() => {
  const { stats } = useLiquidityV3PoolStats();

  return <ListStats stats={stats} slidesToShow={3} />;
});
