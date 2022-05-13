import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { PageTitle, TestnetAlert } from '@shared/components';

import { Details } from './components';
import { useStableswapLiquidityItemPageViewModel } from './stableswap-liquidity-item-page.vm';

export const StableswapLiquidityItemPage: FC = observer(() => {
  const { title } = useStableswapLiquidityItemPageViewModel();

  return (
    <>
      <TestnetAlert />
      <PageTitle>{title}</PageTitle>
      <Details />
    </>
  );
});
