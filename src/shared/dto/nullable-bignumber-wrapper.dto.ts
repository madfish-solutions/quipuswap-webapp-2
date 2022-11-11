import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import type { Nullable } from '@shared/types';

export class NullableBigNumberWrapperDto {
  @Typed({ type: BigNumber, nullable: true })
  value: Nullable<BigNumber>;
}
