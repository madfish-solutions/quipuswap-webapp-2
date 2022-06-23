import { NetworkType } from '@airgap/beacon-sdk';

import { SupportedNetworks, Standard, Token } from '@shared/types';

import { IPFS_GATEWAY } from './config';
import { NETWORK_ID } from './enviroment';

export const TEZOS_TOKEN: Token = {
  type: Standard.Fa12,
  contractAddress: 'tez',
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    name: 'Tezos',
    symbol: 'TEZ',
    thumbnailUri: `${IPFS_GATEWAY}/Qmf3brydfr8c6CKGUUu73Dd7wfBw66Zbzof5E1BWGeU222`
  }
};

export const TEZOS_TOKEN_DECIMALS = TEZOS_TOKEN.metadata.decimals;
export const TEZOS_TOKEN_SYMBOL = TEZOS_TOKEN.metadata.symbol;
export const TEZOS_TOKEN_SLUG = TEZOS_TOKEN.contractAddress;

export const MAINNET_DEFAULT_TOKEN: Token = {
  type: Standard.Fa2,
  contractAddress: 'KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb',
  fa2TokenId: 0,
  isWhitelisted: true,
  metadata: {
    decimals: 6,
    symbol: 'QUIPU',
    name: 'Quipuswap Governance Token',
    thumbnailUri: 'https://quipuswap.com/tokens/quipu.png'
  }
};

export const HANGZHOUNET_DEFAULT_TOKEN: Token = {
  ...MAINNET_DEFAULT_TOKEN,
  contractAddress: 'KT1VowcKqZFGhdcDZA3UN1vrjBLmxV5bxgfJ'
};

export const ITHACANET_DEFAULT_TOKEN: Token = {
  ...MAINNET_DEFAULT_TOKEN,
  contractAddress: 'KT19363aZDTjeRyoDkSLZhCk62pS4xfvxo6c'
};

export const networksDefaultTokens: Record<SupportedNetworks, Token> = {
  [NetworkType.MAINNET]: MAINNET_DEFAULT_TOKEN,
  [NetworkType.ITHACANET]: ITHACANET_DEFAULT_TOKEN
};

export const DEFAULT_TOKEN = networksDefaultTokens[NETWORK_ID];

export const COINFLIP_TOKENS_TO_PLAY = [TEZOS_TOKEN, DEFAULT_TOKEN];
