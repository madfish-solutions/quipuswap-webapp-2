import { Token } from '@shared/types';

interface TokenWrapper {
  token: Token;
}

export const extractTokens = (tokensInfo: Array<TokenWrapper>) => tokensInfo.map(({ token }) => token);
