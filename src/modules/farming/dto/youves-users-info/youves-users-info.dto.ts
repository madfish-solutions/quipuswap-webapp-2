import { Typed } from '@shared/decorators';

import { YouvesStakeDto } from './youves-stake.dto';

export class YouvesUsersInfoDto {
  @Typed({ type: YouvesStakeDto, isArray: true })
  stakes: YouvesStakeDto[];
}
