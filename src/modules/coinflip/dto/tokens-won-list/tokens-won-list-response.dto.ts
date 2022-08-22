import { Typed } from '@shared/decorators';

import { TokenWonDto } from './token-won.dto';

export class TokensWonListResponseDto {
  @Typed({ isArray: true, type: TokenWonDto })
  list: Array<TokenWonDto>;
}
