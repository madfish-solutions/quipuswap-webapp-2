import { mapTokenMeta } from './token-meta.map';
import { RawTokenMetadata } from '../api';
import { getTokenStandard } from '../helpers/tokens/get-token-standard';
import { Token, TokenAddress } from '../types';

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
