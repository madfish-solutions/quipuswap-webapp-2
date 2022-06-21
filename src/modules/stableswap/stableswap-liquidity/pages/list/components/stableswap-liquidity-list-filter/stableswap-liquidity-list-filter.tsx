import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components';

import { useStableswapLiquidityListFilterViewModel } from './use-stableswap-liquidity-list-filter.vm';

export const StableswapLiquidityListFilter: FC = observer(() => {
  const params = useStableswapLiquidityListFilterViewModel();

  return <ListFilterView {...params} />;
});
