import { StakerInfoModel } from './staker-info.model';
import { StakerInfoListResponseDto } from '../dto';

export class StakerInfoListResponseModel extends StakerInfoListResponseDto {
  list: StakerInfoModel[];

  constructor(dto: StakerInfoListResponseDto) {
    super();

    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key as keyof StakerInfoListResponseDto];
    }
    this.list = dto.list.map(item => new StakerInfoModel(item));
  }
}
