import { TokenDataType } from '@shared/types';

export const transformTokenDataToAnalyticsLink = (token: TokenDataType) => {
  const id = token.token.id !== undefined ? `_${token.token.id}` : '';

  return `https://analytics.quipuswap.com/tokens/${token.token.address}${id}`;
};
