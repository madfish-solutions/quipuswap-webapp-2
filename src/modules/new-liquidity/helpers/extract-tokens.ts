import { LiquidityItem } from '../interfaces';

export const extractTokens = (item: LiquidityItem) => {
  return item.tokensInfo.map(({ token }) => token);
};
