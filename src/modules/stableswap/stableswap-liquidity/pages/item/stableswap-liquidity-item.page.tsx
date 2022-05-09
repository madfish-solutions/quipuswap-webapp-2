import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert } from '@shared/components';

import { Details, StableswapFormTabsCard } from './components';
import { useStableswapLiquidityItemPageViewModel } from './stableswap-liquidity-item-page.vm';
import styles from './stableswap-liquidity-item.page.module.scss';

export const StableswapLiquidityItemPage: FC = observer(() => {
  const { getTitle } = useStableswapLiquidityItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{getTitle()}</PageTitle>
      <div className={styles.container}>
        <StableswapFormTabsCard />
        <Details />
      </div>
    </>
  );
});
