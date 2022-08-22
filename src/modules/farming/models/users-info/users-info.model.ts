import { UsersInfoDto } from '../../dto';

export class UsersInfoModel extends UsersInfoDto {
  constructor(dto: UsersInfoDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemDto];
    }
  }
}
