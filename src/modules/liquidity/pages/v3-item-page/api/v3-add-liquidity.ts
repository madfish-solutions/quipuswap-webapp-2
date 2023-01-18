import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { withApproveApiForManyTokens } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { Token } from '@shared/types';

import { MaximumTokensContributed } from '../types';

export const V3AddLiquidityApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  positionId: BigNumber,
  liquidityDelta: BigNumber,
  receiverAddress: string,
  deadline: string,
  tokenX: Token,
  tokenY: Token,
  maximumTokensContributed: MaximumTokensContributed
) => {
  const v3Contract = await tezos.wallet.at(contractAddress);

  const V3LiquidityParams = v3Contract.methodsObject
    .update_position({
      position_id: positionId,
      liquidity_delta: liquidityDelta,
      to_x: receiverAddress,
      to_y: receiverAddress,
      deadline,
      maximum_tokens_contributed: maximumTokensContributed,
      referral_code: QUIPUSWAP_REFERRAL_CODE
    })
    .toTransferParams();

  return await withApproveApiForManyTokens(
    tezos,
    contractAddress,
    [
      {
        token: tokenX,
        amount: maximumTokensContributed.x
      },
      {
        token: tokenY,
        amount: maximumTokensContributed.y
      }
    ],
    receiverAddress,
    [V3LiquidityParams]
  );
};
