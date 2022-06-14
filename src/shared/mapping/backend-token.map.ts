import { RawToken, Standard, Token } from '@shared/types';

export const mapBackendToken = (raw: RawToken, isLp?: boolean, newSymbol?: string): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  isWhitelisted: !!raw.isWhitelisted,
  type: raw.type as Standard,
  metadata: {
    ...raw.metadata,
    decimals: raw.metadata.decimals,
    symbol: newSymbol ?? raw.metadata.symbol
  }
});
