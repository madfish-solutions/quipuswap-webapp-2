import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { StableswapTokensInfo } from '../types';

export class StableswapTokensInfoDto implements StableswapTokensInfo {
  @Typed({ type: BigNumber })
  reserves!: BigNumber;

  @Typed({ type: BigNumber })
  reservesInUsd!: BigNumber;

  @Typed({ type: TokenDto })
  token!: TokenDto;

  @Typed({ type: BigNumber })
  exchangeRate!: BigNumber;
}
