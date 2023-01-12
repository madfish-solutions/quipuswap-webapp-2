import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { QUIPUSWAP_REFERRAL_CODE, ZERO_AMOUNT_BN } from '@config/constants';

import { MaximumTokensContributed } from '../types';

export const V3RemoveLiquidityApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  positionId: BigNumber,
  liquidityDelta: BigNumber,
  receiverAddress: string,
  deadline: string,
  maximumTokensContributed: MaximumTokensContributed
) => {
  const v3Contract = await tezos.wallet.at(contractAddress);

  const V3LiquidityParams = v3Contract.methodsObject.update_position({
    position_id: positionId,
    liquidity_delta: ZERO_AMOUNT_BN.minus(liquidityDelta),
    to_x: receiverAddress,
    to_y: receiverAddress,
    deadline,
    maximum_tokens_contributed: maximumTokensContributed,
    referral_code: QUIPUSWAP_REFERRAL_CODE
  });

  return await V3LiquidityParams.send();
};
