import { TezosToolkit, MichelsonMap, TransferParams } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getWithWtezMintOnInputParams, withApproveApiForManyTokens } from '@blockchain';
import { STABLESWAP_REFERRAL } from '@config/config';
import { DEFAULT_STABLESWAP_POOL_ID } from '@config/constants';
import { TEZOS_TOKEN, WTEZ_TOKEN } from '@config/tokens';
import { isGreaterThanZero, isTezosToken } from '@shared/helpers';
import { AmountToken, Nullable } from '@shared/types';

import { getTotalTokenAmount } from '../../../helpers';
import { Version } from '../../../types';
import { getYupanaRebalanceParams } from './utils';

const createMichelsonAmount = (tokensAndAmounts: Array<AmountToken>) => {
  const michelsonAmounts = new MichelsonMap<number, BigNumber>();
  tokensAndAmounts.forEach(({ amount }, index) => {
    if (isGreaterThanZero(amount)) {
      michelsonAmounts.set(index, amount);
    }
  });

  return michelsonAmounts;
};

const prepareTokensAndAmounts = (tokensAndAmounts: Array<AmountToken>) => {
  return tokensAndAmounts
    .filter(({ amount }) => isGreaterThanZero(amount))
    .map(({ token, amount }) => ({ token: isTezosToken(token) ? WTEZ_TOKEN : token, amount }));
};

export const addStableswapLiquidityApi = async (
  tezos: TezosToolkit,
  stableswapPoolContractAddress: string,
  shares: BigNumber,
  tokensAndAmounts: Array<AmountToken>,
  deadline: string,
  accountPkh: string,
  version: Version,
  receiver: Nullable<string> = null
) => {
  const mutezToMint = getTotalTokenAmount(tokensAndAmounts, TEZOS_TOKEN);
  const receiverFixed = accountPkh === receiver ? null : receiver;
  const stableswapPoolContract = await tezos.wallet.at(stableswapPoolContractAddress);

  const michelsonAmounts = createMichelsonAmount(tokensAndAmounts);

  const swableswapLiquidityParams = stableswapPoolContract.methods
    .invest(DEFAULT_STABLESWAP_POOL_ID, shares, michelsonAmounts, deadline, receiverFixed, STABLESWAP_REFERRAL)
    .toTransferParams();

  const cleanedTokensAmount = prepareTokensAndAmounts(tokensAndAmounts);

  let baseParams: Array<TransferParams> = [];
  if (version === Version.v2) {
    const params = await getYupanaRebalanceParams({
      tezos,
      stableswapContractAddress: stableswapPoolContractAddress,
      stableswapPoolId: DEFAULT_STABLESWAP_POOL_ID,
      tokensInPool: tokensAndAmounts.length
    });

    baseParams = baseParams.concat(params);
  }

  baseParams.push(swableswapLiquidityParams);

  const paramsWithWtezMint = await getWithWtezMintOnInputParams(tezos, mutezToMint, accountPkh, baseParams);

  return await withApproveApiForManyTokens(
    tezos,
    stableswapPoolContractAddress,
    cleanedTokensAmount,
    accountPkh,
    paramsWithWtezMint
  );
};
