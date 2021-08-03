import BigNumber from 'bignumber.js';

export interface QSNetwork {
  id:
  | 'mainnet'
  | 'florencenet'
  | 'edo2net'
  | 'edonet'
  | 'delphinet'
  | 'carthagenet'
  connectType: 'default' | 'custom'
  name: string
  type: 'main' | 'test'
  rpcBaseURL: string
  description: string
  disabled: boolean
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple',
}

export interface WhitelistedToken {
  type: 'fa1.2' | 'fa2'
  contractAddress: string
  fa2TokenId?: number
  metadata: WhitelistedTokenMetadata
}

export interface WhitelistedBaker {
  name: string,
  address: string,
  logo: string,
  votes: number,
  fee: number,
  freeSpace: BigNumber
}

export type WhitelistedTokenMetadata = {
  decimals: number
  symbol: string
  name: string
  thumbnailUri: string
};
