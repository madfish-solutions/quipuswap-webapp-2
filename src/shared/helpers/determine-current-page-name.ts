import { Location } from 'react-router-dom';

import { FISRT_INDEX, SLASH } from '@config/constants';

export const determineCurrentPageName = (location: Location) =>
  location.pathname.split(SLASH).filter(Boolean)[FISRT_INDEX];
