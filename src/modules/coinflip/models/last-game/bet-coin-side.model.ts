import { BetCoinSideDto } from '../../dto';

export class BetCoinSideModel extends BetCoinSideDto {
  constructor(dto: BetCoinSideDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof BetCoinSideDto];
    }
  }
}
