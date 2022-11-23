import { isValidTokenSlug } from '@shared/validators';

import { isArrayPairTuple } from '../arrays';

export const tokenPairSlugIsValid = (tokenPairSlug: string) => {
  const tokensSlugs = tokenPairSlug.split('-');

  if (!isArrayPairTuple(tokensSlugs)) {
    return false;
  }

  const [tokenASlug, tokenBSlug] = tokensSlugs;

  return isValidTokenSlug(tokenASlug) === true && isValidTokenSlug(tokenBSlug) === true;
};
