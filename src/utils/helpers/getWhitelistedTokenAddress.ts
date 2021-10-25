import {WhitelistedToken} from '@utils/types';

export const getWhitelistedTokenAddress = (token: WhitelistedToken) =>
  `${token.contractAddress}${token.fa2TokenId !== undefined ? `_${token.fa2TokenId}` : ''}`;
