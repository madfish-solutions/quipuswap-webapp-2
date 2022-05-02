import { FC } from 'react';

import { Iterator, PageTitle, TestnetAlert } from '@shared/components';

import mockRawPoolInfo from '../.mock/raw-pool-info.json';
import { poolItemMapper } from '../mapping';
import { PoolCard } from './components';
import styles from './stableswap-liquidity.page.module.scss';

const MOCK_DATA = poolItemMapper(mockRawPoolInfo);

const mockData = [
  {
    tvlInUsd: MOCK_DATA.tvlInUsd,
    liquidityProvidersFee: MOCK_DATA.liquidityProvidersFee,
    tokensInfo: MOCK_DATA.tokensInfo,
    poolContractUrl: MOCK_DATA.poolContractUrl,
    isWhitelisted: true
  },
  {
    tvlInUsd: MOCK_DATA.tvlInUsd,
    liquidityProvidersFee: MOCK_DATA.liquidityProvidersFee,
    tokensInfo: MOCK_DATA.tokensInfo,
    poolContractUrl: MOCK_DATA.poolContractUrl,
    isWhitelisted: true
  },
  {
    tvlInUsd: MOCK_DATA.tvlInUsd,
    liquidityProvidersFee: MOCK_DATA.liquidityProvidersFee,
    tokensInfo: MOCK_DATA.tokensInfo,
    poolContractUrl: MOCK_DATA.poolContractUrl,
    isWhitelisted: true
  }
];

export const StableswapLiquidityPage: FC = () => (
  <>
    <TestnetAlert />
    <PageTitle>Stableswap Liquidity</PageTitle>
    <Iterator render={PoolCard} data={mockData} isGrouped wrapperClassName={styles.poolsList} />
  </>
);
