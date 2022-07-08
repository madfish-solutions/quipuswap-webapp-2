import { SKIP, SWAP } from '@config/constants';

import { ManagedToken, Token } from '../../types';

const sortByFavorite = (a: ManagedToken) => (a.isFavorite ? SKIP : SWAP);

const sortByName = (a: Token, b: Token) => (a.metadata.name > b.metadata.name ? SWAP : SKIP);

export const sortManagedToken = (a: ManagedToken, b: ManagedToken) => {
  if (a.isFavorite !== b.isFavorite) {
    return sortByFavorite(a);
  }

  return sortByName(a, b);
};
