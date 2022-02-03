import { DexPair, DexPairType, TTDexPairProps } from '@utils/types';

export const isTokenToTokenDex = (dex: DexPair): dex is TTDexPairProps => dex.type === DexPairType.TokenToToken;
