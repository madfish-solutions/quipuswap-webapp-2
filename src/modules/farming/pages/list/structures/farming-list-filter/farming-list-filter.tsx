import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { ListFilterInputView } from '@shared/components';

import { useFarmingListFilterViewModel } from './use-farming-list-filter.vm';

export const FarmingListFilter: FC = observer(() => {
  const params = useFarmingListFilterViewModel();

  return <ListFilterInputView {...params} />;
});
