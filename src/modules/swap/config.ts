import { DexTypeEnum } from 'swap-router-sdk';

import { DEX_POOL_URL } from '@config/enviroment';

export const TEZOS_DEXES_API_URL = DEX_POOL_URL;

// TODO: add DexTypeEnum.QuipuSwapCurveLike
export const KNOWN_DEX_TYPES = [
  DexTypeEnum.QuipuSwap,
  DexTypeEnum.QuipuSwapTokenToTokenDex,
  DexTypeEnum.QuipuSwapCurveLike
];
