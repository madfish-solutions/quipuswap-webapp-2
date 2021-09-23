import { Token } from '@graphql';

export const prepareTokenName = (
  x: Token,
) : string => x.symbol ?? x.name ?? x.id ?? 'Token';
