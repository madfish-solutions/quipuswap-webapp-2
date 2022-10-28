import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { LiquidityTokenInfo } from '../interfaces';

export class LiquidityTokenInfoDto implements LiquidityTokenInfo {
  @Typed()
  token: TokenDto;

  @Typed()
  atomicTokenTvl: BigNumber;
}
