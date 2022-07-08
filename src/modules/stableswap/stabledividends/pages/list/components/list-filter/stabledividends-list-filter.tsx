import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterView } from '@shared/components';

import { useStableDividendsListFilterViewModel } from './use-stabledividends-list-filter.vm';

export const StableDividendsListFilter: FC = observer(() => {
  const params = useStableDividendsListFilterViewModel();

  return <ListFilterView {...params} />;
});
