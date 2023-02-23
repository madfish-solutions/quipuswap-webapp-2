import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';
import type { Nullable } from '@shared/types';

import { ThreeRouteStandardEnum } from '../types';

export class ThreeRouteTokenDto {
  @Typed()
  id: BigNumber;

  @Typed()
  symbol: string;

  @Typed({ type: String, isEnum: true })
  standard: ThreeRouteStandardEnum;

  @Typed({ type: String, nullable: true })
  contract: Nullable<string>;

  @Typed({ type: String, nullable: true })
  tokenId: Nullable<string>;

  @Typed()
  decimals: BigNumber;
}
