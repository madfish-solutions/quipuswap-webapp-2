import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, ListStats, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools } from './components';
import styles from './new-liquidity-page.module.scss';
import { useNewLiquidityViewModel } from './new-liquidity-page.vm';

export const NewLiquidityPage: FC = observer(() => {
  const { isInitialazied, stats, list } = useNewLiquidityViewModel();
  const { t } = useTranslation();

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
