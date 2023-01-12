import { BigNumber } from 'bignumber.js';
import { DexTypeEnum } from 'swap-router-sdk';

import { Token } from '@shared/types';

export interface RouteFeesAndSlug extends RouteFees {
  tokenSlug: string;
}

export interface RouteFees {
  fee: BigNumber;
  devFee: BigNumber;
}

export interface DexPool {
  dexType: DexTypeEnum;
  dexAddress: string;
  dexId?: BigNumber;
  token1: Token;
  token2: Token;
  token1Pool: BigNumber;
  token2Pool: BigNumber;
  token3?: Token;
  token4?: Token;
  token3Pool?: BigNumber;
  token4Pool?: BigNumber;
}
