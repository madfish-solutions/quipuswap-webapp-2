import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { getWithWtezBurnOnOutputParams, sendBatch } from '@blockchain';
import { QUIPUSWAP_REFERRAL_CODE, ZERO_AMOUNT_BN } from '@config/constants';
import { isTezosToken } from '@shared/helpers';
import { TokenAddress } from '@shared/types';

const DEFAULT_TOKENS_CONTRIBUTED = { x: ZERO_AMOUNT_BN, y: ZERO_AMOUNT_BN };

export const V3RemoveLiquidityApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  positionId: BigNumber,
  liquidityDelta: BigNumber,
  receiverAddress: string,
  deadline: string,
  tokenX: TokenAddress,
  tokenY: TokenAddress,
  tokenXOutput: BigNumber,
  tokenYOutput: BigNumber
) => {
  const v3Contract = await tezos.wallet.at(contractAddress);

  let operationsParams = [
    v3Contract.methodsObject
      .update_position({
        position_id: positionId,
        liquidity_delta: liquidityDelta.negated(),
        to_x: receiverAddress,
        to_y: receiverAddress,
        deadline,
        maximum_tokens_contributed: DEFAULT_TOKENS_CONTRIBUTED,
        referral_code: QUIPUSWAP_REFERRAL_CODE
      })
      .toTransferParams()
  ];

  if (isTezosToken(tokenX)) {
    operationsParams = await getWithWtezBurnOnOutputParams(tezos, tokenXOutput, receiverAddress, operationsParams);
  }
  if (isTezosToken(tokenY)) {
    operationsParams = await getWithWtezBurnOnOutputParams(tezos, tokenYOutput, receiverAddress, operationsParams);
  }

  return await sendBatch(tezos, operationsParams);
};
