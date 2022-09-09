import { StakerInfoResponseDto } from '../dto';
import { StakerInfoModel } from './staker-info.model';

export class StakerInfoResponseModel extends StakerInfoResponseDto {
  item: StakerInfoModel;

  constructor(dto: StakerInfoResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StakerInfoResponseDto];
    }
    this.item = new StakerInfoModel(dto.item);
  }
}
