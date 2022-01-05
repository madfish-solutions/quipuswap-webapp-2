import { TokenId } from '@utils/types';

export const getTokenSlug = (token: TokenId) =>
  token.type === 'fa2' ? `${token.contractAddress}_${token.fa2TokenId}` : token.contractAddress;
