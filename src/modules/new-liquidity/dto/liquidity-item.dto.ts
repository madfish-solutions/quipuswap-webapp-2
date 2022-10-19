import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { Categories, LiquidityItem, LiquidityItemResponse, PoolType } from '../interfaces';
import { LiquidityTokenInfoDto } from './liquidity-token-info.dto';

export class LiquidityItemDto implements LiquidityItem {
  @Typed()
  id: BigNumber;

  @Typed({ type: String })
  type: PoolType;

  @Typed()
  contractAddress: string;

  @Typed()
  feesRate: string;

  @Typed({ optional: true })
  currentDelegate: string;

  @Typed()
  tvlInUsd: BigNumber;

  @Typed()
  totalSupply: BigNumber;

  @Typed({ type: Number, nullable: true })
  apr: Nullable<number>;

  @Typed({ type: Number, nullable: true })
  maxApr: Nullable<number>;

  @Typed({ type: String, isArray: true })
  poolLabels: Array<Categories>;

  @Typed({ type: BigNumber, nullable: true })
  volumeForWeek: Nullable<BigNumber>;

  @Typed({ type: LiquidityTokenInfoDto, isArray: true })
  tokensInfo: Array<LiquidityTokenInfoDto>;

  @Typed({ type: String, optional: true })
  accordanceSlug: string;
}

export class LiquidityItemResponseDto implements LiquidityItemResponse {
  @Typed()
  item: LiquidityItemDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
