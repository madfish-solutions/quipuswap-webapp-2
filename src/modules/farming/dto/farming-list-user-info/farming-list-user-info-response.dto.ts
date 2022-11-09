import { Typed } from '@shared/decorators';

import { FarmingListUserInfoDto } from './farming-list-user-info.dto';

export class FarmingListUserInfoResponseDto {
  @Typed({ isArray: true, type: FarmingListUserInfoDto })
  userInfo: Array<FarmingListUserInfoDto>;
}
