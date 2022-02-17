import { isFullBaker, WhitelistedBaker, WhitelistedBakerFull } from '@utils/types';

import { isExist } from './type-checks';

export const isBackerNotEmpty = (baker: WhitelistedBaker): baker is WhitelistedBakerFull =>
  isFullBaker(baker) && isExist(baker.name);
