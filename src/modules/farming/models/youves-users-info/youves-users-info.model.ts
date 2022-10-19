import { YouvesUsersInfoDto } from '../../dto';
import { YouvesStakeModel } from './youves-stake.model';

export class YouvesUsersInfoModel extends YouvesUsersInfoDto {
  stakes: YouvesStakeModel[];

  constructor(dto: YouvesUsersInfoDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof YouvesUsersInfoDto];
    }

    this.stakes = dto.stakes.map(item => new YouvesStakeModel(item));
  }
}
