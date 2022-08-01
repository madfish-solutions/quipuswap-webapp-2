import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { StableswapTokensInfo } from '../types';

export class StableswapTokensInfoDto implements StableswapTokensInfo {
  @Typed()
  reserves!: BigNumber;

  @Typed()
  reservesInUsd!: BigNumber;

  @Typed()
  token!: TokenDto;

  @Typed()
  exchangeRate!: BigNumber;
}
