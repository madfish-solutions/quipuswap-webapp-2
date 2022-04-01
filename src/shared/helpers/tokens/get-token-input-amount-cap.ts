import { BigNumber } from 'bignumber.js';

import { TEZ_TO_LEAVE } from '@config/config';
import { Optional, Token } from '@shared/types';

import { isTezosToken } from '../get-token-appellation';

export const getTokenInputAmountCap = (token: Optional<Token>) =>
  token && isTezosToken(token) ? TEZ_TO_LEAVE : new BigNumber('0');
