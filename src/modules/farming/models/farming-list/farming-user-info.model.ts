import { UserInfoDto } from '../../dto';

export class UserInfoModel extends UserInfoDto {
  constructor(dto: UserInfoDto) {
    super();
    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
    }
  }
}
