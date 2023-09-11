import { Nullable } from '@shared/types';

import { BetCoinSideModel } from './bet-coin-side.model';
import { GameStatusModel } from './status.model';
import { LastGameDto } from '../../dto';

export class LastGameModel extends LastGameDto {
  betCoinSide: Nullable<BetCoinSideModel>;
  status: Nullable<GameStatusModel>;

  constructor(dto: LastGameDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof GameStatusDto];
      this.betCoinSide = dto.betCoinSide && new BetCoinSideModel(dto.betCoinSide);
      this.status = dto.status && new GameStatusModel(dto.status);
    }
  }
}
