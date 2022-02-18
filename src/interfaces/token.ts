import BigNumber from 'bignumber.js';

import { Standard } from '@graphql';
import { Nullable, TokenMetadata } from '@utils/types';

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

// TODO: Rename it & Use it
export type NewToken = TokenFa12 | TokenFa2;
