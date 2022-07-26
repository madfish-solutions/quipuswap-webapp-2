import { FC } from 'react';

import { Iterator, ListItemCard, ListStats, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools } from './components';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';
import styles from './new-liquidity-page.module.scss';
import { useListStatsViewModel } from './use-list-stats.vm';

export const NewLiquidityPage: FC = () => {
  const { stats } = useListStatsViewModel();
  const { list } = newLiquidityListDataHelper();
  const { t } = useTranslation();

  return (
    <StateWrapper loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <ListStats stats={stats} slidesToShow={3} />

      <HotPools />

      <Iterator render={ListItemCard} data={list} wrapperClassName={styles.newLiquidityList} isGrouped />
    </StateWrapper>
  );
};
