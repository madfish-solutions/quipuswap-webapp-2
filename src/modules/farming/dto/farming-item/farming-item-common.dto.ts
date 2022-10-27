import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';
import { ActiveStatus } from '@shared/types';

import { FarmItemCommon } from '../../interfaces';

export class FarmingItemCommonDto implements FarmItemCommon {
  @Typed()
  id: BigNumber;

  @Typed()
  contractAddress?: string;

  @Typed()
  stakedToken: TokenDto;

  @Typed()
  rewardToken: TokenDto;

  @Typed({ isArray: true, type: TokenDto })
  tokens: Array<TokenDto>;

  @Typed({ nullable: true, type: BigNumber })
  tvlInUsd: Nullable<BigNumber>;

  @Typed()
  apr: BigNumber;

  @Typed()
  apy: BigNumber;

  @Typed()
  earnExchangeRate: BigNumber;

  @Typed()
  depositExchangeRate: BigNumber;

  @Typed()
  old: boolean;

  @Typed({ type: String, isEnum: true })
  stakeStatus: ActiveStatus;

  @Typed()
  staked: BigNumber;

  @Typed({ type: String, optional: true })
  udp?: string;

  @Typed({ type: String, optional: true })
  endTime?: string;

  @Typed({ type: BigNumber, optional: true })
  rewardPerShare?: BigNumber;

  @Typed({ type: BigNumber, optional: true })
  rewardPerSecond?: BigNumber;

  @Typed({ type: String, optional: true })
  timelock?: string;

  @Typed({ type: BigNumber, optional: true })
  withdrawalFee?: BigNumber;
}
