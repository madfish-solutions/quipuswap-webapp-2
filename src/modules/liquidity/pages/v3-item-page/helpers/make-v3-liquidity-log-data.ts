import { BigNumber } from 'bignumber.js';

import { PoolType } from '@modules/liquidity/interfaces';
import { LiquidityV3PositionWithStats } from '@modules/liquidity/types';
import { getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

export const makeV3LiquidityOperationLogData = (
  position: LiquidityV3PositionWithStats,
  slippage: BigNumber,
  tokenX: Token,
  tokenY: Token,
  tokenXAmount: BigNumber,
  tokenYAmount: BigNumber
) => ({
  tokenXSlug: getTokenSlug(tokenX),
  tokenYSlug: getTokenSlug(tokenY),
  tokenXName: tokenY.metadata.name,
  tokenYName: tokenX.metadata.name,
  slippage: slippage.toNumber(),
  positionId: position.id.toNumber(),
  liquidity: position.liquidity.toNumber(),
  positionSizeInUsd: position.stats.depositUsd?.toNumber(),
  tokenXAmount: Number(tokenXAmount),
  tokenYAmount: Number(tokenYAmount),
  poolType: PoolType.UNISWAP
});
