import { TokenMetadata } from "./token-data";
import { FoundDex } from "./dex-type";
import { QSMainNet } from "./qs-network-type";
import { Nullable } from "./type-check";
import { Standard } from "./standard";

export interface TokenPair {
  balance?: Nullable<string>;
  frozenBalance?: Nullable<string>;
  token1: Token;
  token2: Token;
  dex?: Nullable<FoundDex>;
}

export interface Token {
  type: Standard;
  contractAddress: string;
  fa2TokenId?: number;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface TokenWithQSNetworkType extends Token {
  network?: QSMainNet;
}

export type TokenId = Pick<Token, 'contractAddress' | 'fa2TokenId' | 'type'>;
export type TokenIdFa2 = Required<TokenId>;
