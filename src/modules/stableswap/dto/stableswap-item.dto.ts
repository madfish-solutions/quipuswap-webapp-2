import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { StableswapItemNew } from '../types';
import { OpportunityDto } from './opportunity.dto';
import { StableswapFeesDto } from './stableswap-fees.dto';
import { StableswapTokensInfoDto } from './stableswap-tokens-info.dto';

export class StableswapItemDto implements StableswapItemNew {
  @Typed()
  id: BigNumber;

  @Typed()
  poolId: BigNumber;

  @Typed()
  contractAddress: string;

  @Typed({ type: StableswapTokensInfoDto, isArray: true })
  tokensInfo: Array<StableswapTokensInfoDto>;

  @Typed()
  isWhitelisted: boolean;

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
