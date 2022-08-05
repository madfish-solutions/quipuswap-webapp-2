import { Token } from '@shared/types';

import { NewLiquidityLablesInterface } from './new-liquidity-lables.interface';

export enum PoolType {
  STABLESWAP = 'STABLESWAP',
  DEX_TWO = 'DEX_TWO',
  TEZ_TOKEN = 'TEZ_TOKEN',
  TOKEN_TOKEN = 'TOKEN_TOKEN'
}

export interface HotPoolInterface {
  id: number;
  type: PoolType;
  itemUrl: string;
  tvl: string;
  tvlInUsd: number;
  apr: string;
  liquidityProvidersFee: number;
  tokensInfo: Array<Token>;
  newLiquidityLablesData: NewLiquidityLablesInterface;
  isNewLiquidity?: boolean;
}
