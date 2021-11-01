import { estimateSharesInTez, estimateSharesInToken, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import { FormApi } from 'final-form';

import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenDecimals,
  toDecimals,
} from '@utils/helpers';
import { LiquidityFormValues, TokenDataMap, TokenDataType, WhitelistedToken } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';

import { isTez } from './isTez';

interface AddLiquidityHandlerArgs {
  isTokensSame: boolean;
  isValuesSame: boolean;
  tokensData: TokenDataMap;
  isDexSame: boolean;
  val: LiquidityFormValues;
  values: LiquidityFormValues;
  dex?: FoundDex;
  localDex: FoundDex;
  localTezos: TezosToolkit;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  lastChange: 'balance1' | 'balance2';
  form: FormApi<LiquidityFormValues, Partial<LiquidityFormValues>>;
}

export const addLiquidityHandler = async ({
  isTokensSame,
  isValuesSame,
  isDexSame,
  tokensData,
  val,
  values,
  localTezos,
  localDex,
  token1,
  token2,
  lastChange,
  form,
}: AddLiquidityHandlerArgs) => {
  if (!val.balance1 && !val.balance2) return null;
  if (isTokensSame && isValuesSame && isDexSame) return null;

  const rate = toDecimals(
    localDex.storage.storage.token_pool,
    getWhitelistedTokenDecimals(TEZOS_TOKEN),
  ).dividedBy(toDecimals(localDex.storage.storage.tez_pool, getWhitelistedTokenDecimals(token2)));
  const retValue =
    lastChange === 'balance1'
      ? new BigNumber(val.balance1).times(rate)
      : new BigNumber(val.balance2).div(rate);
  const decimals =
    lastChange === 'balance1'
      ? getWhitelistedTokenDecimals(token2)
      : getWhitelistedTokenDecimals(token1);

  const res = retValue.toFixed(decimals);
  form.mutators.setValue(lastChange === 'balance1' ? 'balance2' : 'balance1', res);
  if (!localDex || !val.balance1 || !val.balance2) return null;
  try {
    const getMethod = async (token: TokenDataType, foundDex: FoundDex, value: BigNumber) =>
      isTez(token)
        ? estimateSharesInTez(foundDex.storage, getValueForSDK(token, value, localTezos))
        : estimateSharesInToken(foundDex.storage, getValueForSDK(token, value, localTezos));
    const sharesA = await getMethod(tokensData.first, localDex, new BigNumber(values.balance1));
    const sharesB = await getMethod(
      tokensData.second,
      localDex,
      lastChange === 'balance2' ? new BigNumber(values.balance2) : retValue,
    );

    const lp1 = fromDecimals(sharesA, tokensData.first.token.decimals);
    const lp2 = fromDecimals(sharesB, tokensData.second.token.decimals);

    form.mutators.setValue('estimateLP', lp1.plus(lp2));
    return null;
  } catch (err) {
    return null;
  }
};
