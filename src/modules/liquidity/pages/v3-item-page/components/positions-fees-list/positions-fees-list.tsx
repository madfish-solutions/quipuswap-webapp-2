import { FC } from 'react';

import { FeesList } from '../fees-list';
import { usePositionsFeesListViewModel } from './use-positions-fees-list.vm';

export const PositionsFeesList: FC = () => {
  const params = usePositionsFeesListViewModel();

  return <FeesList {...params} />;
};
