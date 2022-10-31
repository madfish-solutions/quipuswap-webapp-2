import { Nullable, Token } from '@shared/types';

export const findToken = (contractToken: string, idToken: string | undefined, tokens: Token[]): Nullable<Token> =>
  tokens.find(token => {
    if (contractToken !== token.contractAddress) {
      return false;
    }

    if (idToken === undefined) {
      return true;
    }

    return `${token.fa2TokenId}` === idToken;
  }) || null;
