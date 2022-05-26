import { BigNumber } from 'bignumber.js';

import { DexTypeEnum } from '../enum/dex-type.enum';
import { TokenStandardEnum } from '../enum/token-standard.enum';

export interface RoutePair {
  dexType: DexTypeEnum;
  dexAddress: string;
  dexId?: BigNumber;
  aTokenSlug: string;
  aTokenPool: BigNumber;
  aTokenStandard?: TokenStandardEnum;
  aTokenMultiplier?: BigNumber;
  bTokenSlug: string;
  bTokenPool: BigNumber;
  bTokenStandard?: TokenStandardEnum;
  bTokenMultiplier?: BigNumber;
}
