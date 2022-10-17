import { ListFilterView } from '@shared/components';

import { useListFilterViewModel } from './list-filter.vm';

export const ListFilter = () => {
  const params = useListFilterViewModel();

  return <ListFilterView {...params} />;
};
