import { WhitelistedToken, WhitelistedTokenMetadata } from '@utils/types';
import { isValidTokenSlug } from '@utils/validators';

import { shortize } from './shortize';
import { isExist } from './type-checks';

enum MetadataTokenField {
  name = 'name',
  symbol = 'symbol'
}

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

const getTokenNameForTokensPairName = (token: WhitelistedToken) => {
  const shortAddressOrName = parseAddresOrGetField(token.metadata, MetadataTokenField.name);

  if (shortAddressOrName) {
    return shortAddressOrName;
  }

  const shortAddressOrSymbol = parseAddresOrGetField(token.metadata, MetadataTokenField.symbol);

  if (shortAddressOrSymbol) {
    return shortAddressOrSymbol;
  }

  return shortize(token.contractAddress);
};

export const getTokensPairName = (tokenX: WhitelistedToken, tokenY: WhitelistedToken) => {
  return `${getTokenNameForTokensPairName(tokenX)} / ${getTokenNameForTokensPairName(tokenY)}`;
};
