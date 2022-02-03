import { DexPair, DexPairType, TokenXtzDexPairProps } from '@utils/types';

export const isTokenToTezosDex = (dex: DexPair): dex is TokenXtzDexPairProps => dex.type === DexPairType.TokenToXtz;
