import { QUIPU_TOKEN } from '@config/tokens';
import { toReal } from '@shared/helpers';

import { StakerInfoDto } from '../dto';

export class StakerInfoModel extends StakerInfoDto {
  constructor(dto: StakerInfoDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StakerInfoDto];
    }
    this.yourDeposit = toReal(this.yourDeposit, QUIPU_TOKEN);
  }
}
