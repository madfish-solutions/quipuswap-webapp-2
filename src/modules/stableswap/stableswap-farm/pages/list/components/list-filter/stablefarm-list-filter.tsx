import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components';

import { useStableDividendsListFilterViewModel } from './use-stableswap-farm-list-filter.vm';

export const StableDividendsListFilter: FC = observer(() => {
  const params = useStableDividendsListFilterViewModel();

  return <ListFilterView {...params} />;
});
