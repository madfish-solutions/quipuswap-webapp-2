import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';
import type { Nullable } from '@shared/types';

export class FarmingItemV2YouvesDto {
  @Typed()
  id: string;

  @Typed()
  contractAddress: string;

  @Typed({ type: BigNumber, nullable: true })
  apr: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  depositExchangeRate: Nullable<BigNumber>;

  @Typed()
  depositTokenUrl: string;

  @Typed()
  lastRewards: string;

  @Typed({ type: BigNumber })
  discFactor: BigNumber;

  @Typed()
  dailyDistribution: BigNumber;

  @Typed()
  dailyDistributionDollarEquivalent: BigNumber;

  @Typed({ type: BigNumber, nullable: true })
  earnExchangeRate: Nullable<BigNumber>;

  @Typed({ type: BigNumber })
  vestingPeriodSeconds: BigNumber;

  @Typed()
  stakeUrl: string;

  @Typed({ type: TokenDto })
  stakedToken: TokenDto;

  @Typed({ type: TokenDto, isArray: true })
  tokens: Array<TokenDto>;

  @Typed({ type: TokenDto })
  rewardToken: TokenDto;

  @Typed({ type: BigNumber })
  staked: BigNumber;

  @Typed({ type: BigNumber, nullable: true })
  tvlInUsd: Nullable<BigNumber>;

  @Typed()
  tvlInStakedToken: BigNumber;
}
