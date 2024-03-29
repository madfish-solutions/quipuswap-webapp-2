import { Standard, TokenId } from '@shared/types';

export const getTokenIdFromSlug = (slug: string): TokenId => {
  const [contractAddress, fa2TokenId] = slug.split('_');

  return {
    contractAddress,
    fa2TokenId: fa2TokenId ? +fa2TokenId : undefined,
    type: fa2TokenId === undefined ? Standard.Fa12 : Standard.Fa2
  };
};
