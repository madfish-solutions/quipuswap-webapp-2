import { UserInfoResponseDto } from '../../dto';
import { UserInfoModel } from './farming-user-info.model';

export class UserInfoResponseModel extends UserInfoResponseDto {
  userInfo: Array<UserInfoModel>;
  constructor(dto: UserInfoResponseDto) {
    super();

    this.userInfo = dto.userInfo.map(userInfo => new UserInfoModel(userInfo));
  }
}
