import { RawTokenMetadata } from '../api';
import { getTokenStandard } from '../helpers/tokens/get-koken-standard';
import { Token, TokenAddress } from '../types';
import { mapTokenMeta } from './token-meta.map';

interface RawToken extends TokenAddress {
  metadata: RawTokenMetadata;
}

export const mapToken = (raw: RawToken): Token => {
  return {
    ...raw,
    type: getTokenStandard(raw),
    isWhitelisted: false,
    metadata: mapTokenMeta(raw.metadata)
  };
};
