import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterInputView } from '@shared/components';

import { useStableswapLiquidityListFilterViewModel } from './use-stableswap-liquidity-list-filter.vm';

export const StableswapLiquidityListFilter: FC = observer(() => {
  const params = useStableswapLiquidityListFilterViewModel();

  return <ListFilterInputView {...params} />;
});
