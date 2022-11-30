import { DASH } from '@config/constants';
import { isValidTokenSlug } from '@shared/validators';

import { isArrayPairTuple } from '../arrays';

export const tokenPairSlugIsValid = (tokenPairSlug: string) => {
  const tokensSlugs = tokenPairSlug.split(DASH);

  if (!isArrayPairTuple(tokensSlugs)) {
    return false;
  }

  const [tokenASlug, tokenBSlug] = tokensSlugs;

  return isValidTokenSlug(tokenASlug) === true && isValidTokenSlug(tokenBSlug) === true;
};
