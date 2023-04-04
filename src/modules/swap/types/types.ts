import { BigNumber } from 'bignumber.js';
import { DexTypeEnum } from 'swap-router-sdk';

import { Nullable, Token } from '@shared/types';

export interface RouteFeesAndSlug extends RouteFees {
  tokenSlug: string;
}

export interface RouteFees {
  fee: BigNumber;
  devFee: BigNumber;
}

export interface TokenPool {
  token: Token;
  pool: BigNumber;
}

export interface DexPool {
  dexType: DexTypeEnum;
  dexAddress: string;
  dexId?: BigNumber;
  tokensPools: TokenPool[];
}

export enum ThreeRouteStandardEnum {
  xtz = 'xtz',
  fa12 = 'fa12',
  fa2 = 'fa2'
}

export interface ThreeRouteHop {
  dex: BigNumber;
  forward: boolean;
}

export interface ThreeRouteChain {
  input: BigNumber;
  output: BigNumber;
  hops: ThreeRouteHop[];
}

export interface ThreeRouteSwapResponse {
  input: BigNumber;
  output: BigNumber;
  chains: ThreeRouteChain[];
}

interface ThreeRouteTokenCommon {
  id: BigNumber;
  symbol: string;
  standard: ThreeRouteStandardEnum;
  contract: Nullable<string>;
  tokenId: Nullable<string>;
  decimals: BigNumber;
}

export interface ThreeRouteTezosToken extends ThreeRouteTokenCommon {
  standard: ThreeRouteStandardEnum.xtz;
  contract: null;
  tokenId: null;
}

export interface ThreeRouteFa12Token extends ThreeRouteTokenCommon {
  standard: ThreeRouteStandardEnum.fa12;
  tokenId: null;
  contract: string;
}

export interface ThreeRouteFa2Token extends ThreeRouteTokenCommon {
  standard: ThreeRouteStandardEnum.fa2;
  tokenId: string;
  contract: string;
}

export type ThreeRouteToken = ThreeRouteTezosToken | ThreeRouteFa12Token | ThreeRouteFa2Token;

export enum ThreeRouteDexTypeEnum {
  PlentyTokenToToken = 'PlentyTokenToToken',
  PlentyTokenToTokenStable = 'PlentyTokenToTokenStable',
  PlentyTokenToTokenVolatile = 'PlentyTokenToTokenVolatile',
  PlentyCtezStable = 'PlentyCtezStable',
  QuipuSwapTokenToTokenStable = 'QuipuSwapTokenToTokenStable',
  QuipuSwapTezToTokenFa12 = 'QuipuSwapTezToTokenFa12',
  QuipuSwapTezToTokenFa2 = 'QuipuSwapTezToTokenFa2',
  QuipuSwapTokenToToken = 'QuipuSwapTokenToToken',
  QuipuSwapDex2 = 'QuipuSwapDex2',
  DexterLb = 'DexterLb',
  FlatYouvesStable = 'FlatYouvesStable',
  VortexTokenToTokenFa12 = 'VortexTokenToTokenFa12',
  VortexTokenToTokenFa2 = 'VortexTokenToTokenFa2',
  SpicyTokenToToken = 'SpicyTokenToToken',
  WTZSwap = 'WTZSwap',
  CtezToXtz = 'CtezToXtz',
  PlentyWrappedTokenBridgeSwap = 'PlentyWrappedTokenBridgeSwap',
  FlatYouvesStableUXTZ = 'FlatYouvesStableUXTZ'
}

export interface ThreeRouteDex {
  id: BigNumber;
  type: ThreeRouteDexTypeEnum;
  contract: string;
  token1: ThreeRouteToken;
  token2: ThreeRouteToken;
}
