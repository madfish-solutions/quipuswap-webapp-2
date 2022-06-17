import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { Iterator, PageTitle, StateWrapper, TestnetAlert } from '@shared/components';

import { FarmCard, StableswapFarmListFilter } from './components';
import styles from './stableswap-farm-list.page.module.scss';
import { useStableswapFarmListPageViewModel } from './use-stablefarm-list.page.vm';

export const StableswapFarmListPage: FC = observer(() => {
  const { title, data } = useStableswapFarmListPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <StableswapFarmListFilter />
      <StateWrapper loaderFallback={<></>}>
        <Iterator render={FarmCard} data={data} isGrouped wrapperClassName={styles.farmsList} />
      </StateWrapper>
    </>
  );
});
