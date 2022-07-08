import { HIDDEN_TOKENS_KEY } from '@config/localstorage';
import { getTokenSlug } from '@shared/helpers';
import { ManagedToken } from '@shared/types';

export const getHiddenTokensSlugsApi = () => {
  return JSON.parse(localStorage.getItem(HIDDEN_TOKENS_KEY) ?? '[]') as Array<string>;
};

export const hideTokenFromListApi = (token: ManagedToken) => {
  const hiddenTokensSlugs = getHiddenTokensSlugsApi();
  const tokenSlug = getTokenSlug(token);

  localStorage.setItem(HIDDEN_TOKENS_KEY, JSON.stringify([tokenSlug, ...hiddenTokensSlugs]));
};

export const makeTokenVisibleInlistApi = (token: ManagedToken) => {
  const hiddenTokensSlugs = getHiddenTokensSlugsApi();
  const tokenSlug = getTokenSlug(token);

  localStorage.setItem(
    HIDDEN_TOKENS_KEY,
    JSON.stringify([...hiddenTokensSlugs.filter(_tokenSlug => _tokenSlug !== tokenSlug)])
  );
};
