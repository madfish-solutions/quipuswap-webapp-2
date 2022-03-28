import { TEZOS_TOKEN } from '@config';

import { Nullable, Optional, Token, TokenMetadata } from '../types/types';
import { isValidTokenSlug } from '../validators';
import { shortize } from './shortize';
import { isExist } from './type-checks';

// eslint-disable-next-line  @typescript-eslint/no-type-alias
type isAddress = boolean;

enum MetadataTokenField {
  name = 'name',
  symbol = 'symbol'
}

const parseAddresOrGetField = (metadata: TokenMetadata, field: MetadataTokenField): [Nullable<string>, isAddress] => {
  if (isExist(metadata[field])) {
    if (isValidTokenSlug(metadata[field]) === true) {
      return [shortize(metadata[field]), true];
    } else {
      return [metadata[field], false];
    }
  }

  return [null, false];
};

const SLICE_START = 0;
const SLICE_LAST_SYMBOLS_AMOUNT = 2;

const shortizeTokenAppellation = (viewName: string, sliceAmount: number) => {
  if (viewName.length > sliceAmount + SLICE_LAST_SYMBOLS_AMOUNT) {
    return `${viewName.slice(SLICE_START, sliceAmount)}...`;
  } else {
    return viewName;
  }
};

const parseAndShortize = (
  metadata: TokenMetadata,
  field: MetadataTokenField,
  sliceAmount: number
): Nullable<string> => {
  const [shortAddressOrField, isAddress] = parseAddresOrGetField(metadata, field);

  if (isAddress) {
    return shortAddressOrField;
  }

  if (shortAddressOrField) {
    return shortizeTokenAppellation(shortAddressOrField, sliceAmount);
  }

  return null;
};

export const isTezosToken = (token: Token) =>
  token.contractAddress.toLocaleLowerCase() === TEZOS_TOKEN.contractAddress.toLocaleLowerCase();

const TOKEN_LENGTH = 10;

export const getTokenSymbol = (token: Token, sliceAmount = TOKEN_LENGTH) => {
  if (isTezosToken(token)) {
    return TEZOS_TOKEN.metadata.symbol;
  }

  const shortAddressOrSymbol = parseAndShortize(token.metadata, MetadataTokenField.symbol, sliceAmount);

  if (shortAddressOrSymbol) {
    return shortAddressOrSymbol;
  }

  const shortAddressOrName = parseAndShortize(token.metadata, MetadataTokenField.name, sliceAmount);

  if (shortAddressOrName) {
    return shortAddressOrName;
  }

  return shortize(token.contractAddress);
};

export const getTokensName = (token: Token, optionalToken: Optional<Token>) => {
  return optionalToken ? `${getTokenSymbol(token)} / ${getTokenSymbol(optionalToken)}` : getTokenSymbol(token);
};
