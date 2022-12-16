import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { FeesList } from '../fees-list';
import { usePositionFeesListViewModel } from './use-position-fees-list.vm';

export const PositionFeesList: FC = observer(() => {
  const params = usePositionFeesListViewModel();

  return <FeesList {...params} />;
});
