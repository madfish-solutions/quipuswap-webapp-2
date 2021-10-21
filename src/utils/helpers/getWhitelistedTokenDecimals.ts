import { WhitelistedToken } from '@utils/types';

export const getWhitelistedTokenDecimals = (token: WhitelistedToken) => token.metadata.decimals;
