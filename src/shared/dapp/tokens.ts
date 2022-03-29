import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import BigNumber from 'bignumber.js';
import memoizee from 'memoizee';

import {
  IS_NETWORK_MAINNET,
  MAINNET_TOKENS,
  networksDefaultTokens,
  SAVED_TOKENS_KEY,
  TESTNET_TOKENS,
  TEZOS_TOKEN
} from '@config';
import { Standard } from 'types/types';
import { isTokenEqual } from '@shared/helpers/is-token-equal';
import { isClient } from '@shared//helpers/is-client';
import { ipfsToHttps } from '@shared//helpers/ipfs-to-https';
import { getTokenSlug } from '@shared//helpers/get-token-slug';
import { getUniqArray } from '@shared//helpers/arrays';
import { TokenId } from 'types/types';
import { Nullable } from 'types/types';
import { QSNetwork, TokenWithQSNetworkType, QSNets} from 'types/types';
import { Token, TokenPair } from 'types/types';
import { isValidContractAddress } from '@shared//validators/isValidContractAddress';

import { getAllowance } from './get-allowance';
import { getContract } from './get-storage-info';
import { InvalidTokensListError } from './tokens.errors';

interface RawTokenWithQSNetworkType extends Omit<TokenWithQSNetworkType, 'fa2TokenId' | 'isWhitelisted'> {
  fa2TokenId?: string;
  isWhitelisted?: Nullable<boolean>;
}

export const getSavedTokens = (networkId?: QSNets) => {
  const allRawTokens: Array<RawTokenWithQSNetworkType> = isClient
    ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]')
    : [];

  const allTokens: TokenWithQSNetworkType[] = allRawTokens.map(({ fa2TokenId, ...restProps }) => ({
    ...restProps,
    fa2TokenId: fa2TokenId === undefined ? undefined : Number(fa2TokenId),
    isWhitelisted: null
  }));

  return networkId
    ? allTokens.filter(({ network: tokenNetwork }) => !tokenNetwork || tokenNetwork === networkId)
    : allTokens;
};

export const getTokenType = memoizee(
  async (contractOrAddress: string | ContractAbstraction<ContractProvider>, tz: TezosToolkit) => {
    if (typeof contractOrAddress === 'string' && !isValidContractAddress(contractOrAddress)) {
      return undefined;
    }
    const contract =
      typeof contractOrAddress === 'string' ? await getContract(tz, contractOrAddress) : contractOrAddress;
    if (contract.methods.approve) {
      return Standard.Fa12;
    }
    if (contract.methods.update_operators) {
      return Standard.Fa2;
    }

    return undefined;
  },
  { promise: true }
);

export const isTokenFa2 = memoizee(
  async (address: string, tz: TezosToolkit) => {
    if (!isValidContractAddress(address)) {
      return false;
    }

    try {
      const type = await getContract(tz, address);

      return !!type.methods.update_operators;
    } catch (e) {
      return false;
    }
  },
  { promise: true }
);

export const isTokenFa12 = memoizee(
  async (address: string, tz: TezosToolkit) => {
    if (!isValidContractAddress(address)) {
      return false;
    }

    try {
      const type = await getContract(tz, address);

      return !!type.methods.approve;
    } catch (e) {
      return false;
    }
  },
  { promise: true }
);

export const getFallbackTokens = (network: QSNetwork, addTokensFromLocalStorage?: boolean) => {
  let tokens: Array<TokenWithQSNetworkType> = [
    {
      ...TEZOS_TOKEN,
      network: network.id
    },
    networksDefaultTokens[network.id]
  ];

  if (addTokensFromLocalStorage) {
    tokens = tokens.concat(getSavedTokens(network.id));
  }

  return getUniqArray(tokens, getTokenSlug);
};

export const getTokens = async (network: QSNetwork, addTokensFromLocalStorage?: boolean) => {
  let tokens = getFallbackTokens(network, addTokensFromLocalStorage);

  const response = await fetch(ipfsToHttps(IS_NETWORK_MAINNET ? MAINNET_TOKENS : TESTNET_TOKENS));
  const json = await response.json();
  if (json.tokens?.length) {
    // TODO: remove 'any' type as soon as fa2TokenId type is changed to BigNumber
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Tokens: Token[] = json.tokens.map((token: any) => ({
      ...token,
      isWhitelisted: true
    }));

    tokens = tokens.filter(fallbackToken => !Tokens.some(token => isTokenEqual(fallbackToken, token))).concat(Tokens);
  } else {
    throw new InvalidTokensListError(json);
  }

  return getUniqArray(tokens, getTokenSlug);
};

export const saveCustomToken = (token: TokenWithQSNetworkType) => {
  window.localStorage.setItem(
    SAVED_TOKENS_KEY,
    JSON.stringify([token, ...getSavedTokens().filter((x: TokenWithQSNetworkType) => !isTokenEqual(x, token))])
  );
};

// generate cortege of uniq pairs of token1 repo and token2 repo
// export const mergeTokensToPair = (tokens1, tokens2) =>
// [{token1[0]:tokens2[0]},{token1[1]:tokens2[0]},{token1[2]:tokens2[0]},{token1[0]:tokens2[1]},...]

export const mergeTokensToPair = (tokens1: Token[], tokens2: Token[]): TokenPair[] => {
  const pair = { token1: tokens1[0], token2: tokens2[0] } as TokenPair;

  return [pair];
};

export const getWalletContract = memoizee(async (wallet: Wallet, address: string) => wallet.at(address), {
  promise: true
});

export const getAllowanceTransferParams = async (
  tezos: TezosToolkit,
  token: TokenId,
  accountPkh: string,
  spender: string,
  amount: BigNumber
) => {
  if (token.type === Standard.Fa2 || token.contractAddress === TEZOS_TOKEN.contractAddress) {
    return [];
  }
  const tokenContract = await getWalletContract(tezos.wallet, token.contractAddress);
  const allowance = await getAllowance(tezos, token.contractAddress, accountPkh, spender);
  const setAllowanceTransferParams = tokenContract.methods.approve(spender, amount).toTransferParams();
  if (allowance.gt(0)) {
    return [tokenContract.methods.approve(spender, 0).toTransferParams(), setAllowanceTransferParams];
  }

  return [setAllowanceTransferParams];
};

export const makeAddOperatorsTransferMethod = async (
  tezos: TezosToolkit,
  accountPkh: string,
  tokenAddress: string,
  tokensIdsOperators: Record<number, string[]>
) => {
  const tokenContract = await getWalletContract(tezos.wallet, tokenAddress);

  return tokenContract.methods.update_operators(
    Object.entries(tokensIdsOperators).flatMap(([tokenId, operators]) =>
      operators.map(operator => ({
        add_operator: {
          owner: accountPkh,
          operator,
          token_id: new BigNumber(tokenId)
        }
      }))
    )
  );
};

export const makeRemoveOperatorsTransferMethod = memoizee(
  async (
    tezos: TezosToolkit,
    accountPkh: string,
    tokenAddress: string,
    tokensIdsOperators: Record<number, string[]>
  ) => {
    const tokenContract = await getWalletContract(tezos.wallet, tokenAddress);

    return tokenContract.methods.update_operators(
      Object.entries(tokensIdsOperators).flatMap(([tokenId, operators]) =>
        operators.map(operator => ({
          remove_operator: {
            owner: accountPkh,
            operator,
            token_id: new BigNumber(tokenId)
          }
        }))
      )
    );
  }
);
