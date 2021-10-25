import {estimateTezInToken, estimateTokenInTez, FoundDex} from '@quipuswap/sdk';
import BigNumber from 'bignumber.js';
import {TezosToolkit} from '@taquito/taquito';

import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenDecimals,
  toDecimals,
} from '@utils/helpers';
import {LiquidityFormValues, TokenDataMap, WhitelistedToken} from '@utils/types';
import {TEZOS_TOKEN} from '@utils/defaults';

interface RebalanceLiquidityHandlerArgs {
  accountPkh?: string | null;
  val: LiquidityFormValues;
  values: LiquidityFormValues;
  localTezos: TezosToolkit;
  localDex?: FoundDex;
  token2: WhitelistedToken;
  tokensData: TokenDataMap;
}

export const rebalanceLiquidityHandler = ({
  val,
  values,
  localTezos,
  localDex,
  token2,
  accountPkh,
  tokensData,
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
    const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
    const initialBto$ = estimateTezInToken(
      localDex.storage,
      toDecimals(bal2, token2.metadata.decimals),
    );
    const total$ = initialAto$.plus(initialBto$).idiv(2);
    let inputValue: BigNumber;
    const val1 = initialAto$.minus(total$);
    const val2 = toDecimals(bal2, token2.metadata.decimals).minus(
      estimateTokenInTez(localDex.storage, total$),
    );

    const whichTokenPoolIsGreater = val1.gt(val2);
    if (whichTokenPoolIsGreater) {
      inputValue = val1;
    } else {
      inputValue = getValueForSDK(
        tokensData.second,
        fromDecimals(val2, token2.metadata.decimals),
        localTezos,
      );
    }
    const swapValue = total$;
    const rate = toDecimals(
      swapValue.plus(new BigNumber(localDex.storage.storage.token_pool)),
      getWhitelistedTokenDecimals(TEZOS_TOKEN),
    ).dividedBy(toDecimals(localDex.storage.storage.tez_pool, getWhitelistedTokenDecimals(token2)));
    const investValue = (whichTokenPoolIsGreater ? inputValue.times(rate) : inputValue.idiv(rate))
      .idiv(2)
      .minus(1);
    // console.log({
    //   bal1: bal1.toString(),
    //   bal2: bal2.toString(),
    //   initialAto: initialAto$.toString(),
    //   initialBto: initialBto$.toString(),
    //   total: total$.toString(),
    //   val1: val1.toString(),
    //   val2: val2.toString(),
    //   inputValue: inputValue.toString(),
    //   swapValue: swapValue.toString(),
    //   rate: rate.toString(),
    //   investValue: investValue.toString(),
    // })
    return [swapValue, investValue];
  } catch (e) {
    return null;
  }
};
