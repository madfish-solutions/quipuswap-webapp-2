import { estimateSharesInTez, estimateSharesInToken, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';
import { FormApi } from 'final-form';

import { fromDecimals, getValueForSDK, parseDecimals } from '@utils/helpers';
import { LiquidityFormValues, TokenDataMap, TokenDataType, WhitelistedToken } from '@utils/types';

import { isTez } from './isTez';

interface InputUpdateHandlerArgs {
  accountPkh?: string | null;
  values: LiquidityFormValues;
  tezos?: TezosToolkit | null;
  dex?: FoundDex;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  lastChange: 'balance1' | 'balance2';
  tokensData: TokenDataMap;
  form: FormApi<LiquidityFormValues, Partial<LiquidityFormValues>>;
}

export const inputUpdateHandler = async ({
  values,
  tokensData,
  lastChange,
  token1,
  token2,
  dex,
  tezos,
  form,
}: InputUpdateHandlerArgs) => {
  form.mutators.setValue('hiddenSwitcher', !values.hiddenSwitcher);
  if (!values.rebalanceSwitcher) {
    if (!tokensData.first.exchangeRate || !tokensData.second.exchangeRate) {
      return null;
    }
    const rate = new BigNumber(tokensData.first.exchangeRate).dividedBy(
      new BigNumber(tokensData.second.exchangeRate),
    );
    const retValue =
      lastChange === 'balance1'
        ? new BigNumber(values.balance1).times(rate)
        : new BigNumber(values.balance2).dividedBy(rate);
    const decimals =
      lastChange === 'balance1' ? token1.metadata.decimals : token2.metadata.decimals;

    form.mutators.setValue(
      lastChange === 'balance1' ? 'balance2' : 'balance1',
      parseDecimals(retValue.toString(), 0, Infinity, decimals),
    );
    if (!dex || !values.balance1 || !values.balance2 || !tezos) return null;
    try {
      const getMethod = async (token: TokenDataType, foundDex: FoundDex, value: BigNumber) =>
        isTez(token)
          ? estimateSharesInTez(foundDex.storage, getValueForSDK(token, value, tezos))
          : estimateSharesInToken(foundDex.storage, getValueForSDK(token, value, tezos));
      const sharesA = await getMethod(tokensData.first, dex, new BigNumber(values.balance1));
      const sharesB = await getMethod(
        tokensData.second,
        dex,
        lastChange === 'balance2' ? new BigNumber(values.balance2) : retValue,
      );

      const lp1 = fromDecimals(sharesA, tokensData.first.token.decimals);
      const lp2 = fromDecimals(sharesB, tokensData.second.token.decimals);

      form.mutators.setValue('estimateLP', lp1.plus(lp2));
      return null;
    } catch (e) {
      return null;
    }
  }
  return null;
};
