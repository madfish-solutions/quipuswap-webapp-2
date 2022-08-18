import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

export class TokenWonDto {
  @Typed()
  token: TokenDto;

  @Typed({ nullable: true, type: BigNumber })
  amount: BigNumber;
}
