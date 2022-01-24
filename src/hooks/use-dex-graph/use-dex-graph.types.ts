export enum RawDexType {
  QuipuSwap = 'QuipuSwap',
  QuipuSwapTokenToTokenDex = 'QuipuSwapTokenToTokenDex',
  Plenty = 'Plenty',
  LiquidityBaking = 'LiquidityBaking'
}

/*
dexType: DexTypeEnum;
  dexAddress: string;
  dexId?: BigNumber;
  aTokenSlug: string;
  bTokenSlug: string;
  aTokenPool: BigNumber;
  bTokenPool: BigNumber;
*/

export interface RawDexPool {
  dexType: RawDexType;
  dexAddress: string;
  dexId?: string;
  aTokenSlug: string;
  bTokenSlug: string;
  aTokenPool: string;
  bTokenPool: string;
}
