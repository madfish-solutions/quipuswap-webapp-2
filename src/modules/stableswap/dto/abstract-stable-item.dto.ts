import BigNumber from 'bignumber.js';

import { Typed } from '@shared/decorators';

import { StableswapTokensInfoDto } from './stableswap-tokens-info.dto';
import { Version } from '../types';

export abstract class AbstractStableItemDto {
  @Typed()
  id: BigNumber;

  @Typed()
  poolId: BigNumber;

  @Typed()
  contractAddress: string;

  @Typed({ type: StableswapTokensInfoDto, isArray: true })
  tokensInfo: Array<StableswapTokensInfoDto>;

  @Typed()
  isWhitelisted: boolean;

  @Typed({ isEnum: true })
  version: Version;
}
