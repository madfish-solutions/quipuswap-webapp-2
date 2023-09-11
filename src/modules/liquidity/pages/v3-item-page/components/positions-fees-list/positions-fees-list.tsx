import { FC } from 'react';

import { usePositionsFeesListViewModel } from './use-positions-fees-list.vm';
import { FeesList } from '../fees-list';

export const PositionsFeesList: FC = () => {
  const params = usePositionsFeesListViewModel();

  return <FeesList {...params} />;
};
