import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { AbstractStableItemDto } from './abstract-stable-item.dto';
import { OpportunityDto } from './opportunity.dto';
import { StableswapFeesDto } from './stableswap-fees.dto';

export class StableswapItemDto extends AbstractStableItemDto {
  @Typed()
  totalLpSupply: BigNumber;

  @Typed()
  tvlInUsd: BigNumber;

  @Typed()
  poolContractUrl: string;

  @Typed()
  stableswapItemUrl: string;

  @Typed()
  fees: StableswapFeesDto;

  @Typed()
  lpToken: TokenDto;

  @Typed({ type: OpportunityDto, isArray: true, optional: true })
  opportunities?: Array<OpportunityDto>;
}
