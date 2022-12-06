import { FC } from 'react';

import { FeesList } from '../fees-list';
import { usePositionFeesListViewModel } from './use-position-fees-list.vm';

export const PositionFeesList: FC = () => {
  const params = usePositionFeesListViewModel();

  return <FeesList {...params} />;
};
