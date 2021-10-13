import { TokenDataType } from '@utils/types';

export const transformTokenDataToAnalyticsLink = (token: TokenDataType) => `https://analytics.quipuswap.com/tokens/${token.token.address}${token.token.id !== undefined ? `_${token.token.id}` : ''}`;
