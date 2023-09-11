import { YouvesStakeModel } from './youves-stake.model';
import { YouvesStakesResponseDto } from '../../dto';

export class YouvesStakesResponseModel extends YouvesStakesResponseDto {
  stakes: YouvesStakeModel[];

  constructor(dto: YouvesStakesResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof YouvesStakesResponseDto];
    }

    this.stakes = dto.stakes.map(item => new YouvesStakeModel(item));
  }
}
