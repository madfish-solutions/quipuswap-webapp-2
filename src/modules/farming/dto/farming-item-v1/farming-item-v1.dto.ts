import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';
import { ActiveStatus } from '@shared/types';

import { FarmVersion } from '../../interfaces';

export class FarmingItemV1Dto {
  @Typed()
  id: string;

  @Typed()
  contractAddress: string;

  @Typed({ type: BigNumber, nullable: true })
  apr: Nullable<BigNumber>;

  @Typed({ type: BigNumber, nullable: true })
  apy: Nullable<BigNumber>;

  @Typed()
  currentDelegate: string;

  @Typed({ type: BigNumber, nullable: true })
  depositExchangeRate: Nullable<BigNumber>;

  @Typed()
  depositTokenUrl: string;

  @Typed({ type: BigNumber, nullable: true })
  earnExchangeRate: Nullable<BigNumber>;

  @Typed()
  endTime: string;

  @Typed()
  harvestFee: BigNumber;

  @Typed()
  nextDelegate: string;

  @Typed()
  rewardPerSecond: BigNumber;

  @Typed()
  rewardPerShare: BigNumber;

  @Typed()
  rewardToken: TokenDto;

  @Typed({ isEnum: true })
  stakeStatus: ActiveStatus;

  @Typed()
  stakeUrl: string;

  @Typed()
  stakedToken: TokenDto;

  @Typed()
  staked: BigNumber;

  @Typed()
  timelock: string;

  @Typed({ type: TokenDto, isArray: true })
  tokens: Array<TokenDto>;

  @Typed({ type: BigNumber, nullable: true })
  tvlInUsd: Nullable<BigNumber>;

  @Typed()
  tvlInStakedToken: BigNumber;

  @Typed({ optional: true })
  stableswapItemId?: string;

  @Typed()
  udp: string;

  @Typed()
  withdrawalFee: BigNumber;

  @Typed({ isEnum: true })
  version: FarmVersion;

  @Typed()
  /** @deprecated */
  old: boolean;
}
