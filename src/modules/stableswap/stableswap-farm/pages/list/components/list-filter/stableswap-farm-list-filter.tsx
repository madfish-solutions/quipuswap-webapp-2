import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components';

import { useStableswapFarmListFilterViewModel } from './use-stableswap-farm-list-filter.vm';

export const StableswapFarmListFilter: FC = observer(() => {
  const params = useStableswapFarmListFilterViewModel();

  return <ListFilterView {...params} />;
});
