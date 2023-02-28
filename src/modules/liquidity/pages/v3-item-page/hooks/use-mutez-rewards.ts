import { useMemo } from 'react';

import { ZERO_AMOUNT_BN } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { useLiquidityV3ItemTokens, useLiquidityV3PositionStore } from '@modules/liquidity/hooks';
import { getSumOfNumbers, isExist, isTokenEqual, toAtomic } from '@shared/helpers';

import { findUserPosition } from '../helpers';
import { usePositionsWithStats } from './use-positions-with-stats';

export const useMutezRewards = () => {
  const { positionsWithStats } = usePositionsWithStats();
  const { positionId } = useLiquidityV3PositionStore();
  const { tokenX, tokenY } = useLiquidityV3ItemTokens();
  const position = findUserPosition(positionsWithStats, positionId);

  return useMemo(() => {
    if (!isExist(position) || !isExist(tokenX) || !isExist(tokenY)) {
      return ZERO_AMOUNT_BN;
    }

    const { stats: positionStats } = position;
    const { tokenXFees, tokenYFees } = positionStats;

    return getSumOfNumbers(
      [
        { amount: tokenXFees, token: tokenX },
        { amount: tokenYFees, token: tokenY }
      ]
        .filter(({ token }) => isTokenEqual(token, TEZOS_TOKEN))
        .map(({ amount }) => toAtomic(amount, TEZOS_TOKEN))
    );
  }, [position, tokenX, tokenY]);
};
