import { FarmingListUserInfoModel } from './farming-list-user-info.model';
import { FarmingListUserInfoResponseDto } from '../../dto';

export class FarmingListUserInfoResponseModel extends FarmingListUserInfoResponseDto {
  userInfo: Array<FarmingListUserInfoModel>;
  constructor(dto: FarmingListUserInfoResponseDto) {
    super();

    this.userInfo = dto.userInfo.map(userInfo => new FarmingListUserInfoModel(userInfo));
  }
}
