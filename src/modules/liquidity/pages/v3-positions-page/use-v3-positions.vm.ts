import { useParams } from 'react-router-dom';

import { useLiquidityV3ItemStore, useLiquidityV3PositionsStore } from '@modules/liquidity/hooks';

export const useV3PositionsViewModel = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const v3ItemStore = useLiquidityV3ItemStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const v3PositionsStore = useLiquidityV3PositionsStore();

  const params = useParams();

  return { params };
};
