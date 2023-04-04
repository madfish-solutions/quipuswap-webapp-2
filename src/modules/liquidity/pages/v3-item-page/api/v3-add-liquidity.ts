import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getWithWtezBurnOnOutputParams, getWithWtezMintOnInputParams, withApproveApiForManyTokens } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { WTEZ_TOKEN } from '@config/tokens';
import { isGreaterThanZero, isTezosToken } from '@shared/helpers';
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
  maximumTokensContributed: MaximumTokensContributed,
  mutezToBurn: BigNumber
) => {
  const v3Contract = await tezos.wallet.at(contractAddress);

  let addLiquidityParams = [
    v3Contract.methodsObject
      .update_position({
        position_id: positionId,
        liquidity_delta: liquidityDelta,
        to_x: receiverAddress,
        to_y: receiverAddress,
        deadline,
        maximum_tokens_contributed: maximumTokensContributed,
        referral_code: QUIPUSWAP_REFERRAL_CODE
      })
      .toTransferParams()
  ];
  if (isTezosToken(tokenX)) {
    addLiquidityParams = await getWithWtezMintOnInputParams(
      tezos,
      maximumTokensContributed.x,
      receiverAddress,
      addLiquidityParams
    );
  }
  if (isTezosToken(tokenY)) {
    addLiquidityParams = await getWithWtezMintOnInputParams(
      tezos,
      maximumTokensContributed.y,
      receiverAddress,
      addLiquidityParams
    );
  }
  if (isGreaterThanZero(mutezToBurn)) {
    addLiquidityParams = await getWithWtezBurnOnOutputParams(tezos, mutezToBurn, receiverAddress, addLiquidityParams);
  }
  const wrappedTokenX = isTezosToken(tokenX) ? WTEZ_TOKEN : tokenX;
  const wrappedTokenY = isTezosToken(tokenY) ? WTEZ_TOKEN : tokenY;

  return await withApproveApiForManyTokens(
    tezos,
    contractAddress,
    [
      {
        token: wrappedTokenX,
        amount: maximumTokensContributed.x
      },
      {
        token: wrappedTokenY,
        amount: maximumTokensContributed.y
      }
    ],
    receiverAddress,
    addLiquidityParams
  );
};
