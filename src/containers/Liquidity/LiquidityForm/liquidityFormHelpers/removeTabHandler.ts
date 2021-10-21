import {estimateTezInShares, estimateTokenInShares, FoundDex} from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';

import {fromDecimals, getWhitelistedTokenDecimals, toDecimals} from '@utils/helpers';
import {LiquidityFormValues, WhitelistedToken} from '@utils/types';

interface RemoveTabHandlerArgs {
  isTokensSame: boolean;
  isRemValuesSame: boolean;
  isDexSame: boolean;
  values: LiquidityFormValues;
  dex?: FoundDex;
  token1: WhitelistedToken;
  token2: WhitelistedToken;
  form: any;
}

export const removeTabHandler = async ({
  isTokensSame,
  isRemValuesSame,
  isDexSame,
  values,
  dex,
  token1,
  token2,
  form,
}: RemoveTabHandlerArgs) => {
  if ((isTokensSame && isRemValuesSame && isDexSame) || !dex || !values.balance3) {
    return null;
  }
  try {
    const getMethod = async (token: WhitelistedToken, foundDex: FoundDex, value: BigNumber) =>
      token.contractAddress === 'tez'
        ? estimateTezInShares(foundDex.storage, value.toString())
        : estimateTokenInShares(foundDex.storage, value.toString());
    const balance = toDecimals(new BigNumber(values.balance3), 6);
    const sharesA = await getMethod(token1, dex, balance);
    const sharesB = await getMethod(token2, dex, balance);
    const bal1 = fromDecimals(sharesA, token1.metadata.decimals);
    const bal2 = fromDecimals(sharesB, getWhitelistedTokenDecimals(token2));
    form.mutators.setValue('balanceA', bal1);
    form.mutators.setValue('balanceB', bal2);
    return null;
  } catch (e) {
    return null;
  }
};
