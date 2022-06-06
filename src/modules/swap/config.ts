import { DexTypeEnum } from 'swap-router-sdk';

import { DEX_POOL_URL } from '@config/enviroment';

export const ROUTING_FEE_ADDRESS = 'tz1XYSt74vwVWgixEXdiS4C5t3UvuExRRTZR';
export const TEZOS_DEXES_API_URL = DEX_POOL_URL;

export const KNOWN_DEX_TYPES = [
  DexTypeEnum.QuipuSwap,
  DexTypeEnum.QuipuSwapTokenToTokenDex,
  DexTypeEnum.QuipuSwapCurveLike
];
