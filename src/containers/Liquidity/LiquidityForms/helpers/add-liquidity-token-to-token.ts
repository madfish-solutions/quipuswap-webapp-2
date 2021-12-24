import { FoundDex } from '@quipuswap/sdk';
import { TezosToolkit } from '@taquito/taquito';
import BigNumber from 'bignumber.js';

import { allowContractSpendYourTokens } from '@containers/Liquidity/LiquidityForms/helpers/allow-contract-spend-your-tokens';
import { ZERO } from '@utils/defaults';
import { toDecimals } from '@utils/helpers';
import { WhitelistedToken } from '@utils/types';

export const addLiquidityTokenToToken = async (
  tezos: TezosToolkit,
  accountPkh: string,
  dex: FoundDex,
  id: BigNumber,
  tokenAInput: string,
  tokenA: WhitelistedToken,
  tokenB: WhitelistedToken,
  totalSupply: BigNumber,
  tokenAPool: BigNumber,
  tokenBPool: BigNumber
) => {
  const tokenAAmountBN = new BigNumber(tokenAInput);

  const { decimals: decimalsA } = tokenA.metadata;
  const { address: dexAddress } = dex.contract;

  const tokenAAmount = toDecimals(tokenAAmountBN, decimalsA);
  const shares = tokenAAmount.multipliedBy(totalSupply).idiv(tokenAPool);
  const tokenBAmount = shares.multipliedBy(tokenBPool).div(totalSupply).integerValue(BigNumber.ROUND_UP);

  const tokenAResetOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, ZERO, accountPkh);
  const tokenBResetOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, ZERO, accountPkh);
  const tokenAUpdateOperator = allowContractSpendYourTokens(tezos, tokenA, dexAddress, tokenAAmount, accountPkh);
  const tokenBUpdateOperator = allowContractSpendYourTokens(tezos, tokenB, dexAddress, tokenBAmount, accountPkh);

  const [tokenAUpdateResolved, tokenBUpdateResolved, tokenAResetResolved, tokenBResetResolved] = await Promise.all([
    tokenAUpdateOperator,
    tokenBUpdateOperator,
    tokenAResetOperator,
    tokenBResetOperator
  ]);

  const finalCurrentTime = (await tezos.rpc.getBlockHeader()).timestamp;
  const timestamp = new Date(finalCurrentTime).getTime() / 1000 + 900;

  const investParams = dex.contract.methods.invest(id, shares, tokenAAmount, tokenBAmount, timestamp.toString());

  const batch = tezos.wallet
    .batch()
    .withContractCall(tokenAResetResolved)
    .withContractCall(tokenBResetResolved)
    .withContractCall(tokenAUpdateResolved)
    .withContractCall(tokenBUpdateResolved)
    .withContractCall(investParams);

  return batch.send();
};
