import { TEZOS_TOKEN } from '@app.config';
import { Nullable, Optional, WhitelistedToken, WhitelistedTokenMetadata } from '@utils/types';
import { isValidTokenSlug } from '@utils/validators';

import { shortize } from './shortize';
import { isExist } from './type-checks';

// eslint-disable-next-line  @typescript-eslint/no-type-alias
type isAddress = boolean;

enum MetadataTokenField {
  name = 'name',
  symbol = 'symbol'
}

const parseAddresOrGetField = (
  metadata: WhitelistedTokenMetadata,
  field: MetadataTokenField
): [Nullable<string>, isAddress] => {
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
  metadata: WhitelistedTokenMetadata,
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

export const getTokenAppellation = (token: WhitelistedToken, sliceAmount = 10) => {
  if (token.contractAddress.toLocaleLowerCase() === TEZOS_TOKEN.contractAddress.toLocaleLowerCase()) {
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

export const getTokensPairName = (tokenX: WhitelistedToken, tokenY: WhitelistedToken) => {
  return `${getTokenAppellation(tokenX)} / ${getTokenAppellation(tokenY)}`;
};

export const getTokensOptionalPairName = (
  inputToken: Optional<WhitelistedToken>,
  outputToken: Optional<WhitelistedToken>
) => {
  return inputToken && outputToken ? getTokensPairName(inputToken, outputToken) : '';
};
