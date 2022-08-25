import { TokensWonListResponseDto } from '../../dto';
import { TokenWonModel } from './token-won.model';

export class TokensWonListResponseModel extends TokensWonListResponseDto {
  list: Array<TokenWonModel>;

  constructor(dto: TokensWonListResponseDto) {
    super();

    this.list = dto.list.map(data => new TokenWonModel(data));
  }
}
