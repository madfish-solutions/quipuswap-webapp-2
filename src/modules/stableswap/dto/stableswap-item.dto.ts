import { BigNumber } from 'bignumber.js';

import { Typed } from '@shared/decorators';
import { TokenDto } from '@shared/dto';

import { StableswapItemNew } from '../types';
import { StableswapFeesDto } from './stableswap-fees.dto';
import { StableswapTokensInfoDto } from './stableswap-tokens-info.dto';

export class StableswapItemDto implements StableswapItemNew {
  @Typed({ type: BigNumber })
  id!: BigNumber;

  @Typed({ type: BigNumber })
  poolId!: BigNumber;

  @Typed({ type: String })
  contractAddress!: string;

  @Typed({ type: StableswapTokensInfoDto, isArray: true })
  tokensInfo!: Array<StableswapTokensInfoDto>;

  @Typed({ type: Boolean })
  isWhitelisted!: boolean;

  @Typed({ type: BigNumber })
  totalLpSupply!: BigNumber;

  @Typed({ type: BigNumber })
  tvlInUsd!: BigNumber;

  @Typed({ type: String })
  poolContractUrl!: string;

  @Typed({ type: String })
  stableswapItemUrl!: string;

  @Typed({ type: StableswapFeesDto })
  fees!: StableswapFeesDto;

  @Typed({ type: TokenDto })
  lpToken!: TokenDto;
}
