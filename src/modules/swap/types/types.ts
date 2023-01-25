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

export interface TokenPool {
  token: Token;
  pool: BigNumber;
}

export interface DexPool {
  dexType: DexTypeEnum;
  dexAddress: string;
  dexId?: BigNumber;
  tokensPools: TokenPool[];
}
