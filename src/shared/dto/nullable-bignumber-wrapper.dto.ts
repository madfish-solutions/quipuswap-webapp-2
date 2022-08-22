import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

export class NullableBigNumberWrapperDto {
  @Typed({ type: BigNumber, nullable: true })
  value: Nullable<BigNumber>;
}
