import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { AbstractStableItemDto } from './abstract-stable-item.dto';

export class StableswapDividendsItemDto extends AbstractStableItemDto {
  @Typed({ type: BigNumber })
  apr: BigNumber;

  @Typed({ type: BigNumber })
  apy: BigNumber;

  @Typed({ type: BigNumber })
  atomicTvl: BigNumber;

  @Typed({ type: TokenDto })
  stakedToken: TokenDto;

  @Typed()
  farmContractUrl: string;

  @Typed({ type: BigNumber })
  stakedTokenExchangeRate: BigNumber;
}
