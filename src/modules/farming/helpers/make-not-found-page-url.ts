import { Location } from 'react-router-dom';

import { FIRST_INDEX, NOT_FOUND_LETTERS_ROUTE_NAME, SLASH } from '@config/constants';
import { getRouterParts } from '@shared/helpers';

const FARM_ID_INDEX = 2;

export const makeNotFoundPageUrl = (location: Location) => {
  const pathnameParts = getRouterParts(location.pathname)
    .slice(FIRST_INDEX, FARM_ID_INDEX)
    .concat(NOT_FOUND_LETTERS_ROUTE_NAME);

  return SLASH.concat(pathnameParts.join(SLASH));
};
