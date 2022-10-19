import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterInputView } from '@shared/components';

import { useStableDividendsListFilterViewModel } from './use-stabledividends-list-filter.vm';

export const StableDividendsListFilter: FC = observer(() => {
  const params = useStableDividendsListFilterViewModel();

  return <ListFilterInputView {...params} />;
});
