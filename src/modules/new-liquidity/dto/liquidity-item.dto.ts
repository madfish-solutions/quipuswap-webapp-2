import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { BlockInfoDto } from '@shared/dto';

import { LiquidityItem, LiquidityItemWrap } from '../interfaces';
import { LiquidityTokenInfoDto } from './liquidity-token-info.dto';
import { OpportunityDto } from './opportunity.dto';

export class LiquidityItemDto implements LiquidityItem {
  @Typed()
  id: BigNumber;

  @Typed()
  type: string;

  @Typed()
  tvlInUsd: BigNumber;

  @Typed()
  totalSupply: BigNumber;

  @Typed({ type: Number, nullable: true })
  apr: Nullable<number>;

  @Typed({ type: Number, nullable: true })
  maxApr: Nullable<number>;

  @Typed({ type: String, isArray: true })
  poolLabels: Array<string>;

  @Typed({ type: LiquidityTokenInfoDto, isArray: true })
  tokensInfo: Array<LiquidityTokenInfoDto>;

  @Typed({ type: OpportunityDto, isArray: true, optional: true })
  opportunities?: Array<OpportunityDto>;
}

export class LiquidityItemWrapDto implements LiquidityItemWrap {
  @Typed()
  item: LiquidityItemDto;

  @Typed()
  blockInfo: BlockInfoDto;
}
