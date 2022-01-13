import { batchify, FoundDex, removeLiquidity as getRemoveLiquidityParams } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { LP_TOKEN_DECIMALS } from '@app.config';
import { toDecimals } from '@utils/helpers';

const PERCENTAGE = 100;

export const removeLiquidityTez = async (
  tezos: TezosToolkit,
  dex: FoundDex,
  lpTokenInput: string,
  slippageTolerancePercentage: BigNumber
) => {
  const slippageInDecimals = slippageTolerancePercentage.dividedBy(PERCENTAGE);
  const lpTokenBN = new BigNumber(lpTokenInput);
  const shares = toDecimals(lpTokenBN, LP_TOKEN_DECIMALS).integerValue(BigNumber.ROUND_UP);
  const removeLiquidityParams = await getRemoveLiquidityParams(tezos, dex, shares, slippageInDecimals);

  return await batchify(tezos.wallet.batch([]), removeLiquidityParams).send();
};
