import { Location } from 'react-router-dom';

import { SLASH } from '@config/constants';

import { getRouterParts } from './get-router-parts';
import { excludeLastElement } from '../arrays';

export const makeReplaceLastPathnameElementFn = (newElement: string) => (location: Location) => {
  const pathnameElements = excludeLastElement(getRouterParts(location.pathname)).concat(newElement);

  return SLASH.concat(pathnameElements.join(SLASH));
};
