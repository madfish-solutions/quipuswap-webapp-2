import { batchify, FoundDex, removeLiquidity as getRemoveLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS, TEN } from '@utils/defaults';

export const removeLiquidityTez = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  lpTokenInput: string,
  slippageTolerance: BigNumber
) => {
  const ten = new BigNumber(TEN);
  const shares = new BigNumber(lpTokenInput).multipliedBy(ten.pow(LP_TOKEN_DECIMALS)).integerValue(BigNumber.ROUND_UP);
  const removeLiquidityParams = await getRemoveLiquidityParams(tezos, dex, shares, slippageTolerance);

  const walletOperation = await batchify(tezos.wallet.batch([]), removeLiquidityParams).send();

  return walletOperation.confirmation();
};
