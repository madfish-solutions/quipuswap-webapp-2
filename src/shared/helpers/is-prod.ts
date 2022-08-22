import { NETWORK_ID, PROJECT_NAME, VERSION } from '@config/environment';
import { IS_DEV_KEY, IS_PROD_KEY } from '@config/localstorage';

import { isProdDomain } from './is-prod-domain';

export const isProd = () => {
  try {
    if (isProdDomain()) {
      return !localStorage.getItem(IS_DEV_KEY);
    }

    return !!localStorage.getItem(IS_PROD_KEY);
  } catch (_) {
    return true;
  }
};

export const isDev = () => !isProd();

export const getEnvName = () => (isProd() ? 'PROD' : 'DEV');

export const getFullEnvName = () => `${getEnvName()}_${NETWORK_ID}`;

export const getRelease = () => `${PROJECT_NAME}@${VERSION}`;
