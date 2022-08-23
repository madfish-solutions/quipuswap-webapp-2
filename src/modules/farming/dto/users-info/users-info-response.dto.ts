import { Typed } from '@shared/decorators';

import { UsersInfoDto } from './users-info.dto';

export class UsersInfoResponseDto {
  @Typed()
  value: UsersInfoDto;
}
