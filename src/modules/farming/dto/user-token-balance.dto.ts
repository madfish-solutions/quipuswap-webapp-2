import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';
import type { Nullable } from '@shared/types';

export class UserTokenBalanceDto {
  @Typed({ type: BigNumber, nullable: true })
  balance: Nullable<BigNumber>;

  @Typed({ type: TokenDto, optional: true })
  token?: TokenDto;
}
