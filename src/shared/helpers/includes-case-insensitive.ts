import { Optional } from '@shared/types';

import { isExist } from './type-checks';

export const includesCaseInsensitive = (strA: Optional<string>, strB: string) => {
  if (isExist(strA)) {
    return strA.toLowerCase().includes(strB.toLowerCase());
  }

  return false;
};
