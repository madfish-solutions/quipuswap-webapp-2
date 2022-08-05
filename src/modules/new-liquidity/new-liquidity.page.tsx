import { FC } from 'react';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools, NewLiquidityStats } from './components';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';
import styles from './new-liquidity-page.module.scss';

export const NewLiquidityPage: FC = () => {
  const { list, hotPools } = newLiquidityListDataHelper();
  const { t } = useTranslation();

  return (
    <StateWrapper loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <NewLiquidityStats />

      <HotPools pools={hotPools} />

      <Iterator render={ListItemCard} data={list} wrapperClassName={styles.newLiquidityList} isGrouped />
    </StateWrapper>
  );
};
