import { FC } from 'react';

import { ListStats, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools } from './components';
import { useListStatsViewModel } from './use-list-stats.vm';

export const NewLiquidityPage: FC = () => {
  const { stats } = useListStatsViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <ListStats stats={stats} slidesToShow={3} />
      <HotPools />
    </StateWrapper>
  );
};
