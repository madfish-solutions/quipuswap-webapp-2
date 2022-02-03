export enum RawDexType {
  QuipuSwap = 'QuipuSwap',
  QuipuSwapTokenToTokenDex = 'QuipuSwapTokenToTokenDex',
  Plenty = 'Plenty',
  LiquidityBaking = 'LiquidityBaking'
}

export interface RawDexPool {
  dexType: RawDexType;
  dexAddress: string;
  dexId?: string;
  aTokenSlug: string;
  bTokenSlug: string;
  aTokenPool: string;
  bTokenPool: string;
}
