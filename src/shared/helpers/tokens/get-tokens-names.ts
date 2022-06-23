import { SLASH } from '@config/constants';
import { Token } from '@shared/types';

import { getTokenSymbol } from '../get-token-appellation';

export const getTokensNames = (tokens: Array<Token>) => tokens.map(token => getTokenSymbol(token)).join(SLASH);
