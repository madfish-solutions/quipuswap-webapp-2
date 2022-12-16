import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { FeeTokensList } from '../fee-tokens-list';
import { usePositionFeeTokensListViewModel } from './use-position-fee-tokens-list.vm';

export const PositionFeeTokensList: FC = observer(() => {
  const params = usePositionFeeTokensListViewModel();

  return <FeeTokensList {...params} />;
});
