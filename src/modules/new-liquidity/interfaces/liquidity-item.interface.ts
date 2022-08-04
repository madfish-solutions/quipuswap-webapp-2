import { BigNumber } from 'bignumber.js';

import { BlockInfo } from '@shared/types';

import { LiquidityTokenInfo } from './liquidity-token-info.interface';
import { Opportunity } from './opportunities.interface';

export interface LiquidityItem {
  id: BigNumber;
  tvl: BigNumber;
  totalSupply: BigNumber;
  tokensInfo: Array<LiquidityTokenInfo>;
  opportunities?: Array<Opportunity>;
}

export interface LiquidityItemWrap {
  item: LiquidityItem;
  blockInfo: BlockInfo;
}
