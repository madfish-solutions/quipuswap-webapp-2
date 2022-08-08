import { UserInfoResponseDto } from '../../dto';
import { UserInfoModel } from './farming-user-info.model';

export class UserInfoResponseModel extends UserInfoResponseDto {
  userInfo: Array<UserInfoModel>;
  constructor(dto: UserInfoResponseDto) {
    super();
    // eslint-disable-next-line no-console
    console.log(dto);
    this.userInfo = dto.userInfo.map(userInfo => new UserInfoModel(userInfo));
  }
}
