import { GamersStatsDto } from '../dto';

export class GamersStatsModel extends GamersStatsDto {
  constructor(dto: GamersStatsDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof GamersStatsDto];
    }
  }
}
