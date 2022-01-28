import { WhitelistedToken, WhitelistedTokenMetadata } from '@utils/types';
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

const parseAddresOrGetField = (metadata: WhitelistedTokenMetadata, field: MetadataTokenField) => {
  if (isExist(metadata[field])) {
    if (isValidTokenSlug(metadata[field]) === true) {
      return shortize(metadata[field]);
    } else {
      return metadata[field];
    }
  }

  return null;
};

export const getTokenAppellation = (token: WhitelistedToken, sliceAmount = 10) => {
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

export const getTokensPairName = (tokenX: WhitelistedToken, tokenY: WhitelistedToken) => {
  return `${getTokenAppellation(tokenX)} / ${getTokenAppellation(tokenY)}`;
};
