import { Location } from 'react-router-dom';

import { SLASH } from '@config/constants';

import { excludeLastElement } from '../arrays';
import { getRouterParts } from './get-router-parts';

export const makeReplaceLastPathnameElementFn = (newElement: string) => (location: Location) => {
  const pathnameElements = excludeLastElement(getRouterParts(location.pathname)).concat(newElement);

  return SLASH.concat(pathnameElements.join(SLASH));
};
