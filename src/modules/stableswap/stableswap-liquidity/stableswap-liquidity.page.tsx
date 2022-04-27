import { FC } from 'react';

import { PageTitle, TestnetAlert } from '@shared/components';

import { PoolCard } from './components';

export const StableswapLiquidityPage: FC = () => (
  <>
    <TestnetAlert />
    <PageTitle>Stableswap Liquidity</PageTitle>
    <PoolCard />
  </>
);
