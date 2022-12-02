import { EMPTY_STRING, FIRST_INDEX, SLASH } from '@config/constants';
import { QUIPU_TOKEN, TEZOS_TOKEN } from '@config/tokens';
import { Nullable, RawToken, Token, TokenAddress, TokenMetadata } from '@shared/types';
import { isValidTokenSlug } from '@shared/validators';

import { isEmptyArray, isLastElementIndex, isSingleElement, toArray } from './arrays';
import { shortize } from './shortize';
import { getTokenSlug } from './tokens';
import { isExist } from './type-checks';

type isAddress = boolean;
export type RawOrMappedToken = RawToken | Token;

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

const shortizeTokenAppellation = (viewName: string, sliceAmount: number) => {
  if (viewName.length > sliceAmount + 2) {
    return `${viewName.slice(0, sliceAmount)}...`;
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

export const isTezosToken = (token: TokenAddress) =>
  getTokenSlug(token).toLocaleLowerCase() === getTokenSlug(TEZOS_TOKEN).toLocaleLowerCase();

export const isQuipuToken = (token: TokenAddress) => getTokenSlug(token) === getTokenSlug(QUIPU_TOKEN);

const TOKEN_LENGTH = 10;

export const getTokenSymbol = (token: RawOrMappedToken, sliceAmount = TOKEN_LENGTH) => {
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

export const getTokenName = (token: RawOrMappedToken, sliceAmount = TOKEN_LENGTH) => {
  if (isTezosToken(token)) {
    return TEZOS_TOKEN.metadata.name;
  }

  const shortAddressOrName = parseAndShortize(token.metadata, MetadataTokenField.name, sliceAmount);
  if (shortAddressOrName) {
    return shortAddressOrName;
  }

  const shortAddressOrSymbol = parseAndShortize(token.metadata, MetadataTokenField.symbol, sliceAmount);
  if (shortAddressOrSymbol) {
    return shortAddressOrSymbol;
  }

  return shortize(token.contractAddress);
};

export const getSymbolsString = (
  tokens: Nullable<RawOrMappedToken> | Array<Nullable<RawOrMappedToken>>,
  sliceAmount?: number
) => {
  const clearTokens: RawOrMappedToken[] = toArray(tokens).filter(Boolean) as RawOrMappedToken[];

  if (isEmptyArray(clearTokens)) {
    return EMPTY_STRING;
  }

  if (isSingleElement(clearTokens)) {
    return getTokenSymbol(clearTokens[FIRST_INDEX], sliceAmount);
  }

  return clearTokens.reduce(
    (acc, token, index) =>
      !isLastElementIndex(index, clearTokens)
        ? `${acc}${getTokenSymbol(token, sliceAmount)} ${SLASH} `
        : `${acc}${getTokenSymbol(token, sliceAmount)}`,
    ''
  );
};
