import { Location } from 'react-router-dom';

import { FISRT_INDEX, NOT_FOUND_LETTERS_ROUTE_NAME, SLASH } from '@config/constants';
import { getRouterParts } from '@shared/helpers';

const FARM_ID_INDEX = 2;

export const makeNotFoundPageUrl = (location: Location) => {
  const pathnameParts = getRouterParts(location.pathname)
    .slice(FISRT_INDEX, FARM_ID_INDEX)
    .concat(NOT_FOUND_LETTERS_ROUTE_NAME);

  // eslint-disable-next-line no-console
  console.log('fuflo1', SLASH.concat(pathnameParts.join(SLASH)));

  return SLASH.concat(pathnameParts.join(SLASH));
};
