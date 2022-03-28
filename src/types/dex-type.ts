import BigNumber from "bignumber.js";
import { Token } from "./token-type";
import { Contract } from './contract';

export enum DexPairType {
  TokenToToken = 'TokenToToken',
  TokenToXtz = 'TokenToXtz'
}

interface CommonDexPairProps {
  token1Pool: BigNumber;
  token2Pool: BigNumber;
  token1: Token;
  token2: Token;
  id: string | number;
  type: DexPairType;
}

export interface TTDexPairProps extends CommonDexPairProps {
  id: number;
  type: DexPairType.TokenToToken;
}

export interface TokenXtzDexPairProps extends CommonDexPairProps {
  id: string;
  type: DexPairType.TokenToXtz;
}

export type DexPair = TTDexPairProps | TokenXtzDexPairProps;

export class FoundDex {
  constructor(public contract: Contract, public storage: any) {}
}
