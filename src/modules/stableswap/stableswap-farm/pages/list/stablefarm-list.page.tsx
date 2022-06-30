import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, ListItemCard, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { StableFarmListFilter, FarmStats, StableswapLiquidityRewardInfo } from './components';
import styles from './stablefarm-list.page.module.scss';
import { useStableFarmListPageViewModel } from './use-stablefarm-list.page.vm';

export const StableswapFarmListPage: FC = observer(() => {
  const { title, data } = useStableFarmListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <FarmStats />
      <StableswapLiquidityRewardInfo />
      <StableFarmListFilter />
      <StateWrapper loaderFallback={<></>}>
        <Iterator render={ListItemCard} data={data} isGrouped wrapperClassName={styles.farmsList} />
      </StateWrapper>
    </>
  );
});
