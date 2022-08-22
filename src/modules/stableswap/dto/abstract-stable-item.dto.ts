import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { StableswapTokensInfoDto } from './stableswap-tokens-info.dto';

export abstract class AbstractStableItemDto {
  @Typed({ type: BigNumber })
  id: BigNumber;

  @Typed({ type: BigNumber })
  poolId: BigNumber;

  @Typed()
  contractAddress: string;

  @Typed({ type: StableswapTokensInfoDto, isArray: true })
  tokensInfo: Array<StableswapTokensInfoDto>;

  @Typed()
  isWhitelisted: boolean;
}
