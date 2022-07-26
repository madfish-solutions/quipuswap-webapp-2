import { Optional, Token } from '../../types';
import { getTokenSlug } from './token-slug';

export const isTokenIncludes = (token: Token, tokens: Optional<Token[]>) => {
  const tokensSlugs = tokens?.map(getTokenSlug);

  return Boolean(tokensSlugs?.includes(getTokenSlug(token)));
};
