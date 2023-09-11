import { TokenWonModel } from './token-won.model';
import { TokensWonListResponseDto } from '../../dto';

export class TokensWonListResponseModel extends TokensWonListResponseDto {
  list: Array<TokenWonModel>;

  constructor(dto: TokensWonListResponseDto) {
    super();

    this.list = dto.list.map(data => new TokenWonModel(data));
  }
}
