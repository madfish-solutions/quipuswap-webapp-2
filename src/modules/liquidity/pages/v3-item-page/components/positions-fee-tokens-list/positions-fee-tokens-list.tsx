import { FC } from 'react';

import { FeeTokensList } from '../fee-tokens-list';
import { usePositionsFeeTokensListViewModel } from './use-positions-fee-tokens-list.vm';

export const PositionsFeeTokensList: FC = () => {
  const params = usePositionsFeeTokensListViewModel();

  return <FeeTokensList {...params} />;
};
