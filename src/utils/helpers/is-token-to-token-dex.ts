import { DexPair, DexPairType, TTDexPairProps } from '@interfaces/types';

export const isTokenToTokenDex = (dex: DexPair): dex is TTDexPairProps => dex.type === DexPairType.TokenToToken;
