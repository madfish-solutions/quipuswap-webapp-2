import { SKIP, SWAP } from '@config/constants';

import { ManagedToken, Token } from '../../types';

export const sortByFavorite = (a: ManagedToken) => (a.isFavorite ? SKIP : SWAP);

export const sortByName = (a: Token, b: Token) => (a.metadata.name > b.metadata.name ? SWAP : SKIP);
