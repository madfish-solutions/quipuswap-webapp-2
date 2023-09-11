import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { usePositionFeeTokensListViewModel } from './use-position-fee-tokens-list.vm';
import { FeeTokensList } from '../fee-tokens-list';

export const PositionFeeTokensList: FC = observer(() => {
  const params = usePositionFeeTokensListViewModel();

  return <FeeTokensList {...params} />;
});
