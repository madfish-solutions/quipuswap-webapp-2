import { BigNumber } from 'bignumber.js';

import { BlockInfo } from '@shared/types';

import { LiquidityTokenInfo } from './liquidity-token-info.interface';
import { Opportunity } from './opportunities.interface';

export interface LiquidityItem {
  id: BigNumber;
  type: string;
  tvlInUsd: BigNumber;
  apr: Nullable<number>;
  totalSupply: BigNumber;
  maxApr: Nullable<number>;
  volumeForWeek: Nullable<BigNumber>;
  poolLabels: Array<string>;
  tokensInfo: Array<LiquidityTokenInfo>;
  opportunities?: Array<Opportunity>;
}

export interface LiquidityItemResponse {
  item: LiquidityItem;
  blockInfo: BlockInfo;
}
