import { tokenAssetsMap, TOKEN_ASSETS } from '@config/coinflip';
import { defined, getTokenSlug } from '@shared/helpers';
import { Token } from '@shared/types';

export const getTokenAsset = (token: Token): TOKEN_ASSETS => {
  const tokenSlug = getTokenSlug(token);
  const asset = defined(tokenAssetsMap.get(tokenSlug), 'Token asset does not exist');

  return asset.asset;
};
