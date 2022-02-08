import BigNumber from 'bignumber.js';

import { TEZ_TO_LEAVE } from '@app.config';
import { Optional, Token } from '@utils/types';

import { isTezosToken } from './get-token-appellation';

export const getTokenInputAmountCap = (token: Optional<Token>) =>
  token && isTezosToken(token) ? TEZ_TO_LEAVE : new BigNumber('0');
