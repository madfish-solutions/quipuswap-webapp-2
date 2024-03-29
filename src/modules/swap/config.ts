import { DexTypeEnum } from 'swap-router-sdk';

import { DEX_POOL_URL } from '@config/environment';

export const TEZOS_DEXES_API_URL = DEX_POOL_URL;

export const KNOWN_DEX_TYPES = [
  DexTypeEnum.QuipuSwap,
  DexTypeEnum.QuipuSwapTokenToTokenDex,
  DexTypeEnum.QuipuSwapCurveLike,
  DexTypeEnum.QuipuSwap20,
  DexTypeEnum.QuipuSwapV3,
  DexTypeEnum.YupanaWtez
];
