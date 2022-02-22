import { WhitelistedBaker } from '@utils/types';

import { isBackerNotEmpty } from './is-backer-not-empty';
import { shortize } from './shortize';

export const getBakerName = (baker: WhitelistedBaker, shouldShortizeAddress = true) => {
  if (isBackerNotEmpty(baker)) {
    return baker.name;
  }

  return shouldShortizeAddress ? shortize(baker.address) : baker.address;
};
