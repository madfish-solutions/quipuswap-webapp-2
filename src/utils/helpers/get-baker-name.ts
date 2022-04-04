import { WhitelistedBaker } from '@utils/types';

import { shortize } from './shortize';

export enum AddressTransformation {
  NONE = 'NONE',
  SHORTIZE = 'SHORTIZE'
}

export const getBakerName = (baker: WhitelistedBaker, addressTransformation = AddressTransformation.SHORTIZE) => {
  if ('name' in baker) {
    return baker.name;
  }

  return addressTransformation === AddressTransformation.SHORTIZE ? shortize(baker.address) : baker.address;
};
