import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools, NewLiquidityStats } from './components';
import { newLiquidityListDataHelper } from './new-liquidity-list-data.helper';
import styles from './new-liquidity-page.module.scss';
import { useNewLiquidityViewModel } from './new-liquidity-page.vm';

export const NewLiquidityPage: FC = observer(() => {
  const { hotPools } = newLiquidityListDataHelper();
  const { isInitialazied, list } = useNewLiquidityViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper isLoading={!isInitialazied} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <NewLiquidityStats />

      <HotPools pools={hotPools} />

      <Iterator render={ListItemCard} data={list} wrapperClassName={styles.newLiquidityList} isGrouped />
    </StateWrapper>
  );
});
