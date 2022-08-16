import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, TestnetAlert } from '@shared/components';
import { useTranslation } from '@translation';

import { HotPools, NewLiquidityStats } from '../../components';
import styles from './new-liquidity-list-page.module.scss';
import { useNewLiquidityPageViewModel } from './use-new-liquidity-list-page.vm';

export const NewLiquidityListPage: FC = observer(() => {
  const { list, hotPools } = useNewLiquidityPageViewModel();
  const { t } = useTranslation();

  return (
    <>
      <TestnetAlert />

      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>

      <NewLiquidityStats />

      <HotPools pools={hotPools} />

      <Iterator render={ListItemCard} data={list} wrapperClassName={styles.newLiquidityList} isGrouped />
    </>
  );
});
