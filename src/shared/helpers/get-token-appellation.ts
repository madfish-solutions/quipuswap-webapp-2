import { EMPTY_STRING, FISRT_INDEX, SLASH } from '@config/constants';
import { TEZOS_TOKEN } from '@config/tokens';
import { Nullable, Optional, RawToken, Token, TokenAddress, TokenMetadata } from '@shared/types';
import { isValidTokenSlug } from '@shared/validators';

import { isEmptyArray, isLastElementIndex, isSingleElement, toArray } from './arrays';
import { shortize } from './shortize';
import { isExist } from './type-checks';

type isAddress = boolean;
type RawOrMappedToken = RawToken | Token;

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
  token.contractAddress.toLocaleLowerCase() === TEZOS_TOKEN.contractAddress.toLocaleLowerCase();

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

/**
 * @deprecated Use getSymbolsString() instead of that function
 */
export const getTokensPairName = (tokenX: RawOrMappedToken, tokenY: RawOrMappedToken, sliceAmount?: number) => {
  return `${getTokenSymbol(tokenX, sliceAmount)} / ${getTokenSymbol(tokenY, sliceAmount)}`;
};

/**
 * @deprecated Use getSymbolsString() instead of that function
 */
export const getTokensOptionalPairName = (
  inputToken: Optional<RawOrMappedToken>,
  outputToken: Optional<RawOrMappedToken>
) => {
  return inputToken && outputToken ? getTokensPairName(inputToken, outputToken) : '';
};

/**
 * @deprecated Use getSymbolsString() instead of that function
 */
export const getTokensName = (token: RawOrMappedToken, optionalToken: Optional<RawOrMappedToken>) => {
  return optionalToken ? `${getTokenSymbol(token)} / ${getTokenSymbol(optionalToken)}` : getTokenSymbol(token);
};

export const getSymbolsString = (tokens: RawOrMappedToken | Array<RawOrMappedToken>, sliceAmount?: number) => {
  const clearTokens = toArray(tokens).filter(Boolean);

  if (isEmptyArray(clearTokens)) {
    return EMPTY_STRING;
  }

  if (isSingleElement(clearTokens)) {
    return getTokenSymbol(clearTokens[FISRT_INDEX], sliceAmount);
  }

  return clearTokens.reduce(
    (acc, token, index) =>
      !isLastElementIndex(index, clearTokens)
        ? `${acc}${getTokenSymbol(token, sliceAmount)} ${SLASH} `
        : `${acc}${getTokenSymbol(token, sliceAmount)}`,
    ''
  );
};
