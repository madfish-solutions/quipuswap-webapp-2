import { FC } from 'react';

import { ListStats, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { useListStatsViewModel } from './use-list-stats.vm';

export const StakePage: FC = () => {
  const { stats } = useListStatsViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('stake|Liquidity')}</PageTitle>

      <ListStats stats={stats} slidesToShow={3} />
    </StateWrapper>
  );
};
