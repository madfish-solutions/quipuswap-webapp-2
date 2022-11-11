import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';
import type { Nullable } from '@shared/types';

export class TokenWonDto {
  @Typed()
  token: TokenDto;

  @Typed({ nullable: true, type: BigNumber })
  amount: Nullable<BigNumber>;
}
