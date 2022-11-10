import { Typed } from '@shared/decorators';

import { FarmingItemUsersInfoDto } from './farming-item-users-info.dto';

export class FarmingItemUsersInfoResponseDto {
  @Typed()
  value: FarmingItemUsersInfoDto;
}
