import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { ListFilter, PoolCard } from './components';
import styles from './stableswap-liquidity.page.module.scss';
import { useStableswapLiquidityPageViewModel } from './stableswap-liquidity.page.vm';

export const StableswapLiquidityPage: FC = observer(() => {
  const { isLoading, list, title } = useStableswapLiquidityPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <ListFilter />
      {/*TODO: Add sceleton */}
      <StateWrapper isLoading={isLoading} loaderFallback={<></>}>
        <Iterator render={PoolCard} data={list ?? []} isGrouped wrapperClassName={styles.poolsList} />
      </StateWrapper>
    </>
  );
});
