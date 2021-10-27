import { TezosToolkit } from '@taquito/taquito';
import { SAVED_TOKENS_KEY } from '@utils/defaults';
import { WhitelistedToken, WhitelistedTokenList } from '@utils/types';

import { isContractAddress } from '@utils/validators';
import { isClient, isTokenEqual } from '@utils/helpers';

export const getSavedTokens = () =>
  isClient ? JSON.parse(window.localStorage.getItem(SAVED_TOKENS_KEY) || '[]') : [];

export const getContractInfo = (address: string, tz: TezosToolkit) => tz?.contract.at(address);

export const isTokenFa2 = async (address: string, tz: TezosToolkit) => {
  if ((await isContractAddress(address)) === true) {
    let type;
    try {
      type = await getContractInfo(address, tz);
    } catch (e) {
      type = null;
    }
    if (!type) return false;
    return !!type.methods.update_operators;
  }
  return false;
};

export const saveCustomToken = (token: WhitelistedToken) => {
  window.localStorage.setItem(
    SAVED_TOKENS_KEY,
    JSON.stringify([
      token,
      ...getSavedTokens().filter((x: WhitelistedToken) => !isTokenEqual(x, token)),
    ]),
  );
};

export const findTokensByList = (lists: WhitelistedTokenList[]) => {
  const newTokens = lists
    .filter((x) => x.enabled)
    .map((x) => x.tokens)
    .flat();
  const savedTokens: WhitelistedToken[] = getSavedTokens();
  const unionTokens: WhitelistedToken[] = [...savedTokens, ...newTokens];
  const distinctTokens = [
    ...new Map(
      unionTokens.map((item) => [`${item.contractAddress}_${item.fa2TokenId ?? '0'}`, item]),
    ).values(),
  ];

  return distinctTokens;
};
