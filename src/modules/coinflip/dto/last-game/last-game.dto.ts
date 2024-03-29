import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import type { Nullable } from '@shared/types';

import { BetCoinSideDto } from './bet-coin-side.dto';
import { GameStatusDto } from './game-status.dto';

export class LastGameDto {
  @Typed({ type: BigNumber, nullable: true })
  bidSize: Nullable<BigNumber>;

  @Typed({ type: BetCoinSideDto, nullable: true })
  betCoinSide: Nullable<BetCoinSideDto>;

  @Typed({ type: GameStatusDto, nullable: true })
  status: Nullable<GameStatusDto>;
}
