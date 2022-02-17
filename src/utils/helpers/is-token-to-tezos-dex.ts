import { DexPair, DexPairType, TokenXtzDexPairProps } from '@interfaces/types';

export const isTokenToTezosDex = (dex: DexPair): dex is TokenXtzDexPairProps => dex.type === DexPairType.TokenToXtz;
