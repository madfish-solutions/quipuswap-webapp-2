import BigNumber from 'bignumber.js';

import { TEZ_TO_LEAVE } from '@app.config';
import { Optional, RawToken } from '@interfaces/types';

import { isTezosToken } from './get-token-appellation';

export const getTokenInputAmountCap = (token: Optional<RawToken>) =>
  token && isTezosToken(token) ? TEZ_TO_LEAVE : new BigNumber('0');
