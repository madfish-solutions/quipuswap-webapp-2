import { Standard } from '@graphql';
import { TokenId } from '@interfaces/types';

export const getTokenSlug = (token: TokenId) =>
  token.type === Standard.Fa2 ? `${token.contractAddress}_${token.fa2TokenId}` : token.contractAddress;
