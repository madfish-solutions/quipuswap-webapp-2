import BigNumber from 'bignumber.js';

import { TEZOS_TOKEN, TEZ_TO_LEAVE } from '@app.config';
import { Optional, WhitelistedToken } from '@utils/types';

import { isTokenEqual } from './isTokenEqual';

export const getTokenInputAmountCap = (token: Optional<WhitelistedToken>) =>
  token && isTokenEqual(token, TEZOS_TOKEN) ? TEZ_TO_LEAVE : new BigNumber('0');
