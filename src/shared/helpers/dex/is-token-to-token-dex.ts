import { DexPair, DexPairType, TTDexPairProps } from '@shared/types';

export const isTokenToTokenDex = (dex: DexPair): dex is TTDexPairProps => dex.type === DexPairType.TokenToToken;
