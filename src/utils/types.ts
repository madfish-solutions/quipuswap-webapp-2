type QSNetworkType =
  | 'mainnet'
  | 'florencenet'
  | 'edo2net'
  | 'edonet'
  | 'delphinet'
  | 'carthagenet';

export interface QSNetwork {
  id: QSNetworkType
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

export interface WhitelistedTokenPair {
  balance?: string,
  frozenBalance?: string,
  token1: WhitelistedToken,
  token2: WhitelistedToken,
  dex: any
}

export interface WhitelistedToken {
  type: 'fa1.2' | 'fa2'
  contractAddress: string
  fa2TokenId?: number
  metadata: WhitelistedTokenMetadata
  network: QSNetworkType
}

export type WhitelistedTokenMetadata = {
  decimals: number
  symbol: string
  name: string
  thumbnailUri: string
};
