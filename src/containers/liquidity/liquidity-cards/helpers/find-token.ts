import { Nullable, RawToken } from '@interfaces/types';

export const findToken = (contractToken: string, idToken: string, tokens: RawToken[]): Nullable<RawToken> =>
  tokens.find(token => {
    if (contractToken !== token.contractAddress) {
      return false;
    }

    if (idToken === undefined) {
      return true;
    }

    return `${token.fa2TokenId}` === idToken;
  }) || null;
