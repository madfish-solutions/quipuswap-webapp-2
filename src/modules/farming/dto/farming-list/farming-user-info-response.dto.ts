import { Typed } from '@shared/decorators';

import { UserInfoDto } from './farming-user-info.dto';

export class UserInfoResponseDto {
  @Typed({ isArray: true, type: UserInfoDto })
  userInfo: Array<UserInfoDto>;
}
