import { Typed } from '@shared/decorators';

import { StakerInfoDto } from './staker-info.dto';

export class StakerInfoListResponseDto {
  @Typed({ type: StakerInfoDto, isArray: true })
  list: StakerInfoDto[];
}
