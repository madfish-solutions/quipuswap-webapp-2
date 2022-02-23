import { TEZOS_TOKEN } from '@app.config';
import { Nullable, Optional, Token, TokenMetadata } from '@utils/types';
import { isValidTokenSlug } from '@utils/validators';

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

export const getTokenName = (token: Token, sliceAmount = TOKEN_LENGTH) => {
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

export const getTokensPairName = (tokenX: Token, tokenY: Token) => {
  return `${getTokenSymbol(tokenX)} / ${getTokenSymbol(tokenY)}`;
};

export const getTokensOptionalPairName = (inputToken: Optional<Token>, outputToken: Optional<Token>) => {
  return inputToken && outputToken ? getTokensPairName(inputToken, outputToken) : '';
};

export const getTokensName = (token: Token, optionalToken: Optional<Token>) => {
  return optionalToken ? `${getTokenSymbol(token)} / ${getTokenSymbol(optionalToken)}` : getTokenSymbol(token);
};
