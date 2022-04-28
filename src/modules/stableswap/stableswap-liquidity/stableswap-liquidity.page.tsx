import { FC } from 'react';

import { Iterator, PageTitle, TestnetAlert } from '@shared/components';

import { PoolCard } from './components';
import mock from './components/pool-card/mock.json';
import { poolItemMapper } from './components/pool-card/pool-card.map';

const MOCK_DATA = poolItemMapper(mock);

const mockData = {
  tvlInUsd: MOCK_DATA.tvlInUsd,
  liquidityProvidersFee: MOCK_DATA.liquidityProvidersFee,
  tokensInfo: MOCK_DATA.tokensInfo,
  poolContractUrl: MOCK_DATA.poolContractUrl,
  isWhitelisted: true
};

export const StableswapLiquidityPage: FC = () => (
  <>
    <TestnetAlert />
    <PageTitle>Stableswap Liquidity</PageTitle>
    <Iterator render={PoolCard} data={[mockData]} />
  </>
);
