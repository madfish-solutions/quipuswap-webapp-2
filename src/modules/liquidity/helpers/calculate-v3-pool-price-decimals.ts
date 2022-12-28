import { getTokenDecimals } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

export const calculateV3PoolPriceDecimals = (tokenX: Nullable<Token>, tokenY: Nullable<Token>) =>
  getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
