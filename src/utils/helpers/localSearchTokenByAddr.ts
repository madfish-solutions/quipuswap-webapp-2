import {WhitelistedToken} from '@utils/types';
import {getWhitelistedTokenAddress} from './getWhitelistedTokenAddress';

export const localSearchTokenByAddr = (
  token: WhitelistedToken,
  oldInput: string,
  oldInputToken: number,
) =>
  getWhitelistedTokenAddress(token) ===
  `${oldInput}${oldInputToken !== undefined ? `_${oldInputToken}` : ''}`;
