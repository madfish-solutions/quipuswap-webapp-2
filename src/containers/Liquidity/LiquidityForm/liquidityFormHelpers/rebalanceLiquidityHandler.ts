import { estimateTezInToken, estimateTokenInTez, FoundDex } from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import { TezosToolkit } from '@taquito/taquito';

import { fromDecimals, getValueForSDK, toDecimals } from '@utils/helpers';
import { LiquidityFormValues, TokenDataMap, WhitelistedToken } from '@utils/types';
import { TEZOS_TOKEN } from '@utils/defaults';

interface RebalanceLiquidityHandlerArgs {
  accountPkh?: string | null;
  val: LiquidityFormValues;
  values: LiquidityFormValues;
  localTezos: TezosToolkit;
  localDex?: FoundDex;
  token2: WhitelistedToken;
  tokensData: TokenDataMap;
  setRebalance: (arr: any[]) => void;
}

export const rebalanceLiquidityHandler = async ({
  val,
  values,
  localTezos,
  localDex,
  token2,
  accountPkh,
  tokensData,
  setRebalance,
}: RebalanceLiquidityHandlerArgs) => {
  if (!localDex || !accountPkh || !localTezos) return null;
  if (
    (val.balance1 && val.balance1.toString() === '.') ||
    (val.balance2 && val.balance2.toString() === '.')
  ) {
    return null;
  }
  try {
    const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
    const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
    const exA = new BigNumber(1);
    const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
    const initialBto$ = estimateTezInToken(
      localDex.storage,
      toDecimals(bal2, token2.metadata.decimals),
    );
    const total$ = initialAto$.plus(initialBto$).div(2).integerValue(BigNumber.ROUND_DOWN);
    let inputValue: BigNumber;
    const val1 = initialAto$.minus(total$);
    const val2 = toDecimals(bal2, token2.metadata.decimals).minus(
      estimateTokenInTez(localDex.storage, total$),
    );

    const whichTokenPoolIsGreater = val1.gt(val2);
    if (whichTokenPoolIsGreater) {
      inputValue = val1.div(exA);
    } else {
      inputValue = getValueForSDK(
        tokensData.second,
        fromDecimals(val2, token2.metadata.decimals),
        localTezos,
      );
    }
    const tezValue = total$;
    setRebalance([tezValue, inputValue]);
    return null;
  } catch (e) {
    return null;
  }
};
