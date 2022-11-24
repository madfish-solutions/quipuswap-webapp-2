import { FC } from 'react';

import { useV3PositionsViewModel } from './use-v3-positions.vm';

export const V3PositionsPage: FC = () => {
  const { params } = useV3PositionsViewModel();

  return <div>{JSON.stringify(params)}</div>;
};
