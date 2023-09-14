import { MichelsonMapKey } from '@taquito/michelson-encoder';
import { MichelsonMap } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

export type address = string;
export type timestamp = string;
export type key_hash = string;
export type nat = BigNumber;
export type int = BigNumber;
export type bytes = string;
export type LedgerKey = [string, BigNumber];

export type BigMapKeyType = string | number | object;

export interface BigMap<Key extends BigMapKeyType, Value> {
  get(keyToEncode: Key, block?: number): Promise<Value | undefined>;
  getMultipleValues(
    keysToEncode: Array<Key>,
    block?: number,
    batchSize?: number
  ): Promise<MichelsonMap<MichelsonMapKey, Value | undefined>>;
  toJSON(): string;
  toString(): string;
}

export interface TezToken {
  tez: never;
}

export interface FA12Token {
  fa12: address;
}

export interface FA2Token {
  fa2: {
    token_address: address;
    token_id: nat;
  };
}

export type TokensValue = TezToken | FA12Token | FA2Token;

export type Option<T> = { Some: T } | null;
