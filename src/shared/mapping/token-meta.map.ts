import { RawTokenMetadata } from '../api';
import { Nullable, TokenMetadata } from '../types';

export const mapTokenMeta = (raw: Nullable<RawTokenMetadata>): TokenMetadata => {
  if (!raw) {
    return {
      decimals: 0,
      symbol: '',
      name: '',
      thumbnailUri: ''
    };
  }

  const { name, symbol, decimals, thumbnailUri } = raw;

  return {
    decimals,
    symbol,
    name,
    thumbnailUri
  };
};
