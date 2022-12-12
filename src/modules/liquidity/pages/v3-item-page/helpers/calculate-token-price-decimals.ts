import { getTokenDecimals } from '@shared/helpers';
import { Nullable, Token } from '@shared/types';

export const calculateTokenPriceDecimals = (tokenX: Nullable<Token>, tokenY: Nullable<Token>) =>
  getTokenDecimals(tokenY) - getTokenDecimals(tokenX);
