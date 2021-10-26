import {
  Dex,
  estimateTezToToken,
  estimateTokenInTez,
  estimateTokenToTez,
  FA1_2,
  FoundDex,
  toContract,
  withSlippage,
  withTokenApprove,
} from '@quipuswap/sdk';
import {TezosToolkit} from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import {TEZOS_TOKEN} from '@utils/defaults';
import {toDecimals} from '@utils/helpers';
import {LiquidityFormValues, TokenDataMap, WhitelistedToken} from '@utils/types';

interface RebalanceFunctionArgs {
  dex?: FoundDex | null;
  tezos?: TezosToolkit | null;
  accountPkh?: string | null;
  values: LiquidityFormValues;
  token2: WhitelistedToken;
  tokensData: TokenDataMap;
  slippage: BigNumber;
  updateToast: (err: Error) => void;
}

export const rebalanceFunction = async ({
  dex,
  accountPkh,
  tezos,
  values,
  token2,
  tokensData,
  slippage,
  updateToast,
}: RebalanceFunctionArgs) => {
  let liquidityParams = [];
  const toAsset = {
    contract: tokensData.second.token.address,
    id: tokensData.second.token.id ?? undefined,
  };
  if (!dex || !accountPkh || !tezos) return [];
  const tokenFa12AllowanceValue = new BigNumber(0);
  try {
    const bal1 = new BigNumber(values.balance1 ? values.balance1 : 0);
    const bal2 = new BigNumber(values.balance2 ? values.balance2 : 0);
    const initialAtoTez = toDecimals(bal1, TEZOS_TOKEN.metadata.decimals);
    const initialBtoTez = estimateTokenToTez(
      dex.storage,
      toDecimals(bal2, token2.metadata.decimals),
    );
    const totalTez = initialAtoTez.plus(initialBtoTez).idiv(2);
    let inputValue: BigNumber;
    const val1 = initialAtoTez.minus(totalTez);
    const val2 = initialBtoTez.minus(totalTez).lt(0)
      ? 0
      : estimateTokenToTez(dex.storage, initialBtoTez.minus(totalTez));

    const whichTokenPoolIsGreater = val1.gt(val2);
    let swapParams;
    let investTezValue;
    let investTokenValue;
    if (whichTokenPoolIsGreater) {
      inputValue = val1;
      const valueToMin = withSlippage(estimateTezToToken(dex.storage, inputValue), slippage);
      swapParams = Dex.tezToTokenPayment(dex.contract, inputValue, valueToMin, accountPkh);
      investTokenValue = valueToMin;
      investTezValue = estimateTokenToTez(dex.storage, investTokenValue);
    } else {
      const val2InToken = estimateTezToToken(dex.storage, val2);
      tokenFa12AllowanceValue.plus(val2InToken);
      const valueToMin = withSlippage(estimateTokenToTez(dex.storage, val2InToken), slippage);
      swapParams = Dex.tokenToTezPayment(dex.contract, val2InToken, valueToMin, accountPkh);
      investTezValue = valueToMin;
      investTokenValue = estimateTokenInTez(dex.storage, valueToMin);
    }
    const investParams = Dex.investLiquidity(dex.contract, investTokenValue, investTezValue);

    liquidityParams = [swapParams, investParams];
    if (token2.fa2TokenId === undefined) {
      const tokenContract = await toContract(tezos, token2.contractAddress);
      const approveParamsInput = await FA1_2.approve(
        tokenContract,
        dex.contract.address,
        tokenFa12AllowanceValue,
      );
      const approveParams0 = await FA1_2.approve(tokenContract, dex.contract.address, 0);
      liquidityParams = [approveParamsInput, ...liquidityParams, approveParams0];
    } else {
      liquidityParams = await withTokenApprove(
        tezos,
        toAsset,
        accountPkh,
        dex.contract.address,
        tokenFa12AllowanceValue,
        liquidityParams,
      );
    }
  } catch (e: any) {
    updateToast(e);
    return [];
  }
  return liquidityParams;
};
