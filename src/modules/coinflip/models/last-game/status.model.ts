import { GameStatusDto } from '../../dto';

export class GameStatusModel extends GameStatusDto {
  constructor(dto: GameStatusDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof GameStatusDto];
    }
  }
}
