import { FC } from 'react';

import { usePositionsFeeTokensListViewModel } from './use-positions-fee-tokens-list.vm';
import { FeeTokensList } from '../fee-tokens-list';

export const PositionsFeeTokensList: FC = () => {
  const params = usePositionsFeeTokensListViewModel();

  return <FeeTokensList {...params} />;
};
