import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getWithWtezMintOnInputParams, withApproveApiForManyTokens } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { TEZOS_TOKEN, WTEZ_TOKEN } from '@config/tokens';
import { isGreaterThanZero, isTezosToken } from '@shared/helpers';
import { AmountToken, Nullable } from '@shared/types';

import { getTotalTokenAmount } from '../helpers';

export const addStableswapLiquidityApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: string,
  accountPkh: string,
  receiver: Nullable<string> = null
) => {
  const mutezToMint = getTotalTokenAmount(tokensAndAmounts, TEZOS_TOKEN);
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const michelsonAmounts = new MichelsonMap();
  tokensAndAmounts.forEach(({ amount }, index) => {
    if (isGreaterThanZero(amount)) {
      michelsonAmounts.set(index, amount);
    }
  });

  const swableswapLiquidityParams = stableswapPoolContract.methods
    .invest(DEFAULT_STABLESWAP_POOL_ID, shares, michelsonAmounts, deadline, receiverFixed, STABLESWAP_REFERRAL)
    .toTransferParams();

  const cleanedTokensAmount = tokensAndAmounts
    .filter(({ amount }) => isGreaterThanZero(amount))
    .map(({ token, amount }) => ({ token: isTezosToken(token) ? WTEZ_TOKEN : token, amount }));

  return await withApproveApiForManyTokens(
    tezos,
    stableswapPoolContractAddress,
    cleanedTokensAmount,
    accountPkh,
    await getWithWtezMintOnInputParams(tezos, mutezToMint, accountPkh, [swableswapLiquidityParams])
  );
};
