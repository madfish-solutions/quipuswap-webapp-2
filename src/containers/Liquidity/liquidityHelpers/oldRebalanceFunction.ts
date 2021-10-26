import {
  addLiquidity,
  estimateTezToToken,
  estimateTokenInTez,
  FA1_2,
  FoundDex,
  swap,
  toContract,
} from '@quipuswap/sdk';
import {TezosToolkit, TransferParams} from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {FACTORIES, TEZOS_TOKEN} from '@utils/defaults';
import {
  fromDecimals,
  getValueForSDK,
  getWhitelistedTokenDecimals,
  toDecimals,
} from '@utils/helpers';
import {LiquidityFormValues, QSMainNet, TokenDataMap, WhitelistedToken} from '@utils/types';

interface OldRebalanceFunctionArgs {
  dex?: FoundDex | null;
  tezos?: TezosToolkit | null;
  accountPkh?: string | null;
  values: LiquidityFormValues;
  token2: WhitelistedToken;
  tokensData: TokenDataMap;
  networkId: QSMainNet;
  updateToast: (err: Error) => void;
}

export const oldRebalanceFunction = async ({
  dex,
  accountPkh,
  tezos,
  values,
  token2,
  tokensData,
  networkId,
  updateToast,
}: OldRebalanceFunctionArgs) => {
  let liquidityParams: TransferParams[] = [];
  const toAsset = {
    contract: tokensData.second.token.address,
    id: tokensData.second.token.id ?? undefined,
  };

  if (!dex || !accountPkh || !tezos) return liquidityParams;
  try {
    const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
    const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
    const initialAto$ = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
    const initialBto$ = estimateTezToToken(dex.storage, toDecimals(bal2, token2.metadata.decimals));
    const total$ = initialAto$.plus(initialBto$).idiv(2);
    let inputValue: BigNumber;
    const val1 = initialAto$.minus(total$).abs();
    const val2 = toDecimals(bal2, token2.metadata.decimals)
      .minus(estimateTokenInTez(dex.storage, total$))
      .abs();

    const whichTokenPoolIsGreater = val1.gt(val2);
    if (whichTokenPoolIsGreater) {
      inputValue = val1;
    } else {
      inputValue = getValueForSDK(
        tokensData.second,
        fromDecimals(val2, token2.metadata.decimals),
        tezos,
      );
    }
    const fromAsset = 'tez';
    const swapParams = await swap(
      tezos,
      FACTORIES[networkId],
      !whichTokenPoolIsGreater ? toAsset : fromAsset,
      whichTokenPoolIsGreater ? toAsset : fromAsset,
      inputValue,
      0,
    );

    const swapValue = total$;
    const rate = toDecimals(
      swapValue.plus(new BigNumber(dex.storage.storage.token_pool)),
      getWhitelistedTokenDecimals(TEZOS_TOKEN),
    ).dividedBy(toDecimals(dex.storage.storage.tez_pool, getWhitelistedTokenDecimals(token2)));
    const investValue = (
      whichTokenPoolIsGreater ? inputValue.times(rate) : inputValue.idiv(rate)
    ).minus(1);

    const investParams = await addLiquidity(tezos, dex, {tezValue: investValue});

    liquidityParams = swapParams.concat(investParams);
    if (token2.fa2TokenId === undefined) {
      const tokenContract = await toContract(tezos, token2.contractAddress);
      const approveParams = await FA1_2.approve(tokenContract, dex.contract.address, 0);
      liquidityParams = liquidityParams.concat(approveParams);
    }
  } catch (e: any) {
    updateToast(e);
    return [];
  }
  return liquidityParams;
};
