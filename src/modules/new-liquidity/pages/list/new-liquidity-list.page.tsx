import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListItemCard, PageTitle, TestnetAlert, VirtualList } from '@shared/components';
import { useTranslation } from '@translation';

import { CreateOwnPool, HotPools, NewLiquidityStats } from '../../components';
import { ListFilter } from './components';
import styles from './new-liquidity-list-page.module.scss';
import { useNewLiquidityPageViewModel } from './use-new-liquidity-list-page.vm';

export const NewLiquidityListPage: FC = observer(() => {
  const { preparedList, preparedHotPools } = useNewLiquidityPageViewModel();
  const { t } = useTranslation();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{t('newLiquidity|Liquidity')}</PageTitle>
      <NewLiquidityStats />
      <HotPools pools={preparedHotPools} />
      <CreateOwnPool />
      <ListFilter />
      <VirtualList items={preparedList} render={ListItemCard} wrapperClassName={styles.newLiquidityList} />
    </>
  );
});
