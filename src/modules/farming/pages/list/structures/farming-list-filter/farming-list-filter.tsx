import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components';

import { useFarmingListFilterViewModel } from './use-farming-list-filter.vm';

export const FarmingListFilter: FC = observer(() => {
  const params = useFarmingListFilterViewModel();

  return <ListFilterView {...params} />;
});
