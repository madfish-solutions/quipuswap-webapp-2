import { TEZOS_TOKEN } from '@app.config';
import { Optional, Token, TokenMetadata } from '@utils/types';
import { isValidTokenSlug } from '@utils/validators';

import { shortize } from './shortize';
import { isExist } from './type-checks';

enum MetadataTokenField {
  name = 'name',
  symbol = 'symbol'
}

const shortizeTokenAppellation = (viewName: string, sliceAmount: number) => {
  if (viewName.length > sliceAmount + 2) {
    return `${viewName.slice(0, sliceAmount)}...`;
  } else {
    return viewName;
  }
};

const parseAddresOrGetField = (metadata: TokenMetadata, field: MetadataTokenField) => {
  if (isExist(metadata[field])) {
    if (isValidTokenSlug(metadata[field]) === true) {
      return shortize(metadata[field]);
    } else {
      return metadata[field];
    }
  }

  return null;
};

export const getTokenAppellation = (token: Token, sliceAmount = 10) => {
  if (token.contractAddress === TEZOS_TOKEN.contractAddress) {
    return TEZOS_TOKEN.metadata.symbol;
  }

  const shortAddressOrSymbol = parseAddresOrGetField(token.metadata, MetadataTokenField.symbol);

  if (shortAddressOrSymbol) {
    return shortizeTokenAppellation(shortAddressOrSymbol, sliceAmount);
  }

  const shortAddressOrName = parseAddresOrGetField(token.metadata, MetadataTokenField.name);

  if (shortAddressOrName) {
    return shortizeTokenAppellation(shortAddressOrName, sliceAmount);
  }

  return shortize(token.contractAddress);
};

export const getTokensPairName = (tokenX: Token, tokenY: Token) => {
  return `${getTokenAppellation(tokenX)} / ${getTokenAppellation(tokenY)}`;
};

export const getTokensOptionalPairName = (inputToken: Optional<Token>, outputToken: Optional<Token>) => {
  return inputToken && outputToken ? getTokensPairName(inputToken, outputToken) : '';
};
