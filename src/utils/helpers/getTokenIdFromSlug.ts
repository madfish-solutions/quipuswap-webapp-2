import { TokenId } from '@utils/types';

export const getTokenIdFromSlug = (slug: string): TokenId => {
  const [contractAddress, fa2TokenId] = slug.split('_');
  return {
    contractAddress,
    fa2TokenId: fa2TokenId ? +fa2TokenId : undefined,
    type: fa2TokenId === undefined ? 'fa1.2' : 'fa2',
  };
};
