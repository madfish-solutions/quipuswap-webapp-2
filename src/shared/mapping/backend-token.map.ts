import { DEFAULT_DECIMALS } from '@config/constants';
import { RawToken, Token } from '@shared/types';

export const mapBackendToken = (raw: RawToken, isLp?: boolean, newSymbol?: string): Token => ({
  ...raw,
  fa2TokenId: raw.fa2TokenId === undefined ? undefined : Number(raw.fa2TokenId),
  metadata: {
    ...raw.metadata,
    decimals: isLp ? DEFAULT_DECIMALS : raw.metadata.decimals,
    symbol: newSymbol ?? raw.metadata.symbol
  }
});
