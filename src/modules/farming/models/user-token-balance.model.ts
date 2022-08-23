import { toReal } from '@shared/helpers';

import { UserTokenBalanceDto } from '../dto';

export class UserTokenBalanceModel extends UserTokenBalanceDto {
  constructor(dto: UserTokenBalanceDto) {
    super();
    for (const key in dto) {
      //@ts-ignore
      this[key] = dto[key];
      this.balance = this.balance && toReal(this.balance, this.token);
    }
  }
}
