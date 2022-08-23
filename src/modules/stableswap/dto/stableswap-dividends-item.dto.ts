import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { AbstractStableItemDto } from './abstract-stable-item.dto';

export class StableswapDividendsItemDto extends AbstractStableItemDto {
  @Typed()
  apr: BigNumber;

  @Typed()
  apy: BigNumber;

  @Typed()
  atomicTvl: BigNumber;

  @Typed({ type: TokenDto })
  stakedToken: TokenDto;

  @Typed()
  farmContractUrl: string;

  @Typed()
  stakedTokenExchangeRate: BigNumber;
}
