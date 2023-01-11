import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListItemCard, PageTitle, TestnetAlert, VirtualList } from '@shared/components';
import { useTranslation } from '@translation';

import { CreateOwnPool, HotPools, LiquidityStats } from '../../components';
import { ListFilter } from './components';
import styles from './liquidity-list-page.module.scss';
import { useLiquidityPageViewModel } from './use-liquidity-list-page.vm';

export const LiquidityListPage: FC = observer(() => {
  const { preparedList, preparedHotPools } = useLiquidityPageViewModel();
  const { t } = useTranslation();

  return (
    <>
      <TestnetAlert />
      <PageTitle data-test-id="LiquidityListTitle">{t('liquidity|Liquidity')}</PageTitle>
      <LiquidityStats />
      <HotPools pools={preparedHotPools} />
      <CreateOwnPool />
      <ListFilter />
      <VirtualList data={preparedList} render={ListItemCard} wrapperClassName={styles.liquidityList} />
    </>
  );
});
