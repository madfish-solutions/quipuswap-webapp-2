import { useEffect, useState } from 'react';

import { MAINNET_DEFAULT_TOKEN, TEZOS_TOKEN } from '@app.config';
import { StateWrapper } from '@components/state-wrapper';

import { eStakeStatus, StakeListSkeleton, EmptyStakeList } from './components';
import { Iterator } from './helpers/iterator';
import styles from './stake-list.page.module.scss';
import { StakeListItem } from './structures';

const MOCK = [
  {
    tokenA: TEZOS_TOKEN,
    tokenB: MAINNET_DEFAULT_TOKEN,
    stakeStatus: eStakeStatus.ACTIVE,
    rewardToken: MAINNET_DEFAULT_TOKEN,
    tvl: '' + Math.random() * 10000000,
    apr: Math.random() * 10000,
    apy: Math.random() * 100000,
    myBalance: '1000000',
    depositBalance: '1000000',
    earnBalance: '1000000',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    depositExhangeRate: '0.0257213123',
    // eslint-disable-next-line sonarjs/no-duplicate-string
    earnExhangeRate: '0.2321123213',
    stakeUrl: 'https://google.com',
    depositTokenUrl: 'https://yahoo.com'
  },
  {
    tokenA: MAINNET_DEFAULT_TOKEN,
    stakeStatus: eStakeStatus.ACTIVE,
    rewardToken: TEZOS_TOKEN,
    tvl: '' + Math.random() * 10000000,
    apr: Math.random() * 10000,
    apy: Math.random() * 100000,
    myBalance: '1000000',
    depositBalance: '1000000',
    earnBalance: '1000000',
    depositExhangeRate: '0.0257213123',
    earnExhangeRate: '0.2321123213',
    stakeUrl: '',
    depositTokenUrl: ''
  },
  {
    tokenA: TEZOS_TOKEN,
    stakeStatus: eStakeStatus.PAUSED,
    rewardToken: MAINNET_DEFAULT_TOKEN,
    tvl: '' + Math.random() * 10000000,
    apr: Math.random() * 10000,
    apy: Math.random() * 100000,
    myBalance: '1000000',
    depositBalance: '1000000',
    earnBalance: '1000000',
    depositExhangeRate: '0.0257213123',
    earnExhangeRate: '0.2321123213',
    stakeUrl: '',
    depositTokenUrl: ''
  }
];

export const StakeList = () => {
  const [data, setData] = useState([...MOCK, ...MOCK, ...MOCK, ...MOCK, ...MOCK, ...MOCK]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      if (Math.random() < 0.3) {
        setData([]);
      }
      setLoading(false);
    }, 1500);
  }, []);

  return (
    <div>
      <StateWrapper isLoading={loading} loaderFallback={<StakeListSkeleton />}>
        <Iterator
          data={data}
          render={StakeListItem}
          fallback={<EmptyStakeList />}
          isGrouped
          wrapperClassName={styles.list}
        />
      </StateWrapper>
    </div>
  );
};
