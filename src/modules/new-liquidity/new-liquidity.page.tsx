import { FC, useEffect } from 'react';

import { observer } from 'mobx-react-lite';

import { useReady } from '@providers/use-dapp';
import { Iterator, ListItemCard, ListStats, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools } from './components';
import { useGetNewLiquidityStats } from './hooks/use-get-new-liquidity-stats';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';
import styles from './new-liquidity-page.module.scss';
import { useNewLiquidityViewModel } from './new-liquidity-page.vm';
import { useListStatsViewModel } from './use-list-stats.vm';

export const NewLiquidityPage: FC = observer(() => {
  const { isInitialazied } = useNewLiquidityViewModel();
  const { getNewLiquidityStats } = useGetNewLiquidityStats();
  const { stats } = useListStatsViewModel();
  const { list } = newLiquidityListDataHelper();
  const isReady = useReady();
  const { t } = useTranslation();

  useEffect(() => {
    if (isReady) {
      void getNewLiquidityStats();
    }
  }, [getNewLiquidityStats, isReady]);

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <ListStats stats={stats} slidesToShow={3} />

      <HotPools />

      <Iterator render={ListItemCard} data={list} wrapperClassName={styles.newLiquidityList} isGrouped />
    </StateWrapper>
  );
});
