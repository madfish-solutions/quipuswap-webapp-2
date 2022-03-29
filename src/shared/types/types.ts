import BigNumber from 'bignumber.js';

export type Undefined<T> = T | undefined;
export type Nullable<T> = T | null;
export type Optional<T> = T | null | undefined;

export type QSMainNet = 'mainnet' | 'hangzhounet';

export enum QSNets {
  mainnet = 'mainnet',
  hangzhounet = 'hangzhounet'
}

export interface QSNetwork {
  id: QSMainNet;
  connectType: 'custom' | 'default';
  name: string;
  type: 'main' | 'test';
  rpcBaseURL: string;
  metadata: string;
  description: string;
  disabled: boolean;
}

export enum QSNetworkType {
  MAIN = 'MAIN',
  TEST = 'TEST'
}

export enum WalletType {
  BEACON = 'beacon',
  TEMPLE = 'temple'
}

export enum Standard {
  Null = 'Null',
  Fa12 = 'FA12',
  Fa2 = 'FA2'
}

export enum ConnectType {
  DEFAULT = 'DEFAULT',
  CUSTOM = 'CUSTOM'
}

export interface Token {
  type: Standard;
  contractAddress: string;
  fa2TokenId?: number;
  isWhitelisted: Nullable<boolean>;
  metadata: TokenMetadata;
}

export interface TokenMetadata {
  decimals: number;
  symbol: string;
  name: string;
  thumbnailUri: string;
}

export type WhitelistedBaker = WhitelistedBakerEmpty | WhitelistedBakerFull;

export interface WhitelistedBakerEmpty {
  address: string;
}

export interface WhitelistedBakerFull extends WhitelistedBakerEmpty {
  name: string;
  logo: string;
  votes: number;
  fee: number;
  freeSpace: BigNumber;
}
