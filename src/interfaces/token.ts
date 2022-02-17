import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';
import { Nullable, TokenMetadata } from '@interfaces/types';

interface TokenAbstract {
  contractAddress: string;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface TokenFa12 extends TokenAbstract {
  type: Standard.Fa12;
}

export interface TokenFa2 extends TokenAbstract {
  type: Standard.Fa2;
  fa2TokenId: BigNumber;
}

// TODO: Use it
export type Token = TokenFa12 | TokenFa2;
