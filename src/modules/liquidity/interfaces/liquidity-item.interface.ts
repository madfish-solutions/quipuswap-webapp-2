import { BigNumber } from 'bignumber.js';

import { BlockInfo, ActiveStatus, Token } from '@shared/types';

import { Categories } from './icon-enum';
import { LiquidityTokenInfo } from './liquidity-token-info.interface';

export interface PreparedLiquidityItem {
  id: BigNumber;
  type: string;
  tvlInUsd: BigNumber;
  maxApr: Nullable<number>;
  itemStats: Array<{
    cellName: string;
    tooltip: string;
    amounts: {
      amount: BigNumber | number;
      currency: string;
      dollarEquivalent?: BigNumber;
      dollarEquivalentOnly?: boolean;
    };
  }>;
  categories: Array<Categories>;
  inputToken: Array<Token>;
  href: string;
  status: { status: ActiveStatus; filled: boolean };
}

export interface LiquidityItem {
  id: BigNumber;
  type: string;
  contractAddress: string;
  tvlInUsd: BigNumber;
  apr: Nullable<number>;
  totalSupply: BigNumber;
  maxApr: Nullable<number>;
  volumeForWeek: Nullable<BigNumber>;
  poolLabels: Array<Categories>;
  tokensInfo: Array<LiquidityTokenInfo>;
  accordanceSlug?: string;
  feesRate: string;
}

export interface LiquidityItemResponse {
  item: LiquidityItem;
  blockInfo: BlockInfo;
}
