import { getTokenSlug } from './token-slug';
import { Optional, Token } from '../../types';

export const isTokenIncludes = (token: Token, tokens: Optional<Token[]>) => {
  const tokensSlugs = tokens?.map(getTokenSlug);

  return Boolean(tokensSlugs?.includes(getTokenSlug(token)));
};
