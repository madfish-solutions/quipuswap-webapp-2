import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components';

import { useStableFarmListFilterViewModel } from './use-stableswap-farm-list-filter.vm';

export const StableFarmListFilter: FC = observer(() => {
  const params = useStableFarmListFilterViewModel();

  return <ListFilterView {...params} />;
});
