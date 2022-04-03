import { DexPair, DexPairType, TokenXtzDexPairProps } from '@shared/types';

export const isTokenToTezosDex = (dex: DexPair): dex is TokenXtzDexPairProps => dex.type === DexPairType.TokenToXtz;
