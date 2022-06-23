import { SLASH } from '@config/constants';
import { Token } from '@shared/types';

import { getTokenSymbol } from '../get-token-appellation';

export const getTokensNames = (tokens: Array<Token>) =>
  tokens.reduce((accum, value) => accum + SLASH + getTokenSymbol(value), '');
