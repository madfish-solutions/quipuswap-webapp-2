import { ContractAbstraction, ContractProvider, TezosToolkit, Wallet } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import memoizee from 'memoizee';

import { getAllowance } from '@blockchain';
import { TOKENS } from '@config/config';
import { networksQuipuTokens, TEZOS_TOKEN } from '@config/tokens';
import { getSavedTokensApi } from '@shared/api';
import { getContract } from '@shared/dapp';
import { InvalidTokensListError } from '@shared/errors';
import { QSNetwork, Standard, Token, TokenId, TokenPair, TokenWithQSNetworkType } from '@shared/types';
import { isValidContractAddress } from '@shared/validators';

import { isTokenEqual } from './is-token-equal';
import { getTokenSlug } from './token-slug';
import { mapBackendToken } from '../../mapping';
import { getUniqArray } from '../arrays';

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

export const isNewTokenFa2 = memoizee(
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

export const isNewTokenFa12 = memoizee(
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
    networksQuipuTokens[network.id]
  ];

  if (addTokensFromLocalStorage) {
    tokens = tokens.concat(getSavedTokensApi(network.id));
  }

  return getUniqArray(tokens, getTokenSlug);
};

export const getTokens = async (network: QSNetwork, addTokensFromLocalStorage?: boolean) => {
  let tokens = getFallbackTokens(network, addTokensFromLocalStorage);

  const arr: Token[] = TOKENS?.tokens?.length ? TOKENS.tokens.map(token => mapBackendToken(token)) : [];

  if (arr.length) {
    const Tokens: Token[] = arr.map(token => ({
      ...token,
      isWhitelisted: true
    }));

    tokens = tokens.filter(fallbackToken => !Tokens.some(token => isTokenEqual(fallbackToken, token))).concat(Tokens);
  } else {
    throw new InvalidTokensListError(TOKENS);
  }

  return getUniqArray(tokens, getTokenSlug);
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
