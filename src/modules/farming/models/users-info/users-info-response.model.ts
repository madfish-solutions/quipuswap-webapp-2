import { FarmingItemUsersInfoResponseDto } from '../../dto';

export class UsersInfoResponseModel extends FarmingItemUsersInfoResponseDto {
  constructor(dto: FarmingItemUsersInfoResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof FarmingItemUsersInfoResponseDto];
    }
  }
}
