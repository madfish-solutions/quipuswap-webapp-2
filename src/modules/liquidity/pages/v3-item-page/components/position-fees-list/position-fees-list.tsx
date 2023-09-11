import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { usePositionFeesListViewModel } from './use-position-fees-list.vm';
import { FeesList } from '../fees-list';

export const PositionFeesList: FC = observer(() => {
  const params = usePositionFeesListViewModel();

  return <FeesList {...params} />;
});
