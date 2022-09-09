import { Typed } from '@shared/decorators';

import { StakerInfoDto } from './staker-info.dto';

export class StakerInfoResponseDto {
  @Typed({ type: StakerInfoDto })
  item: StakerInfoDto;
}
