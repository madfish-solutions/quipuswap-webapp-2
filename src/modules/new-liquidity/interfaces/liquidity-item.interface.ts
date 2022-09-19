import { BigNumber } from 'bignumber.js';

import { BlockInfo } from '@shared/types';

import { Categories } from './icon-enum';
import { LiquidityTokenInfo } from './liquidity-token-info.interface';

export interface LiquidityItem {
  id: BigNumber;
  type: string;
  tvlInUsd: BigNumber;
  apr: Nullable<number>;
  totalSupply: BigNumber;
  maxApr: Nullable<number>;
  volumeForWeek: Nullable<BigNumber>;
  poolLabels: Array<Categories>;
  tokensInfo: Array<LiquidityTokenInfo>;
}

export interface LiquidityItemResponse {
  item: LiquidityItem;
  blockInfo: BlockInfo;
}
