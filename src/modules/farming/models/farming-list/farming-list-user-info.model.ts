import { FarmingListUserInfoDto } from '../../dto';

export class FarmingListUserInfoModel extends FarmingListUserInfoDto {
  constructor(dto: FarmingListUserInfoDto) {
    super();
    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }
  }
}
