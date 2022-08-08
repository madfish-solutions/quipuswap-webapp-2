import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools, NewLiquidityStats } from './components';
import styles from './new-liquidity-page.module.scss';
import { useNewLiquidityPageViewModel } from './use-new-liquidity-page.vm';

export const NewLiquidityPage: FC = observer(() => {
  const { isInitialized, list } = useNewLiquidityPageViewModel();
  const { t } = useTranslation();

  return (
    <StateWrapper isLoading={!isInitialized} loaderFallback={<div>loading...</div>}>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <NewLiquidityStats />

      <HotPools pools={[]} />

      <Iterator render={ListItemCard} data={list} wrapperClassName={styles.newLiquidityList} isGrouped />
    </StateWrapper>
  );
});
