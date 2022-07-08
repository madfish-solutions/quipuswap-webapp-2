import { FAVORITE_TOKENS_KEY } from '@config/localstorage';
import { getTokenSlug } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

export const getFavoritesTokensSlugsApi = () => {
  return JSON.parse(localStorage.getItem(FAVORITE_TOKENS_KEY) ?? '[]') as Array<string>;
};

export const markTokenAsFavotireApi = (token: ManagedToken) => {
  const favoritesTokensSlugs = getFavoritesTokensSlugsApi();
  const tokenSlug = getTokenSlug(token);

  localStorage.setItem(FAVORITE_TOKENS_KEY, JSON.stringify([tokenSlug, ...favoritesTokensSlugs]));
};

export const removeFavoriteMarkFromTokenApi = (token: ManagedToken) => {
  const favoritesTokensSlugs = getFavoritesTokensSlugsApi();
  const tokenSlug = getTokenSlug(token);

  localStorage.setItem(
    FAVORITE_TOKENS_KEY,
    JSON.stringify([...favoritesTokensSlugs.filter(_tokenSlug => _tokenSlug !== tokenSlug)])
  );
};
