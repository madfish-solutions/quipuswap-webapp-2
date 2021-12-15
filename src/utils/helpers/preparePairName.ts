import { Token } from '@graphql';

import { shortize } from './shortize';

export const prepareTokenName = (x: Token): string => x.symbol ?? x.name ?? shortize(x.id ?? 'Token');
