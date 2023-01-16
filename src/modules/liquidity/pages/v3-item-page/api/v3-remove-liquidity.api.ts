import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

import { QUIPUSWAP_REFERRAL_CODE, ZERO_AMOUNT_BN } from '@config/constants';

const DEFAULT_TOKENS_CONTRIBUTED = { x: ZERO_AMOUNT_BN, y: ZERO_AMOUNT_BN };

export const V3RemoveLiquidityApi = async (
  tezos: TezosToolkit,
  contractAddress: string,
  positionId: BigNumber,
  liquidityDelta: BigNumber,
  receiverAddress: string,
  deadline: string
) => {
  const v3Contract = await tezos.wallet.at(contractAddress);

  const V3LiquidityParams = v3Contract.methodsObject.update_position({
    position_id: positionId,
    liquidity_delta: liquidityDelta.negated(),
    to_x: receiverAddress,
    to_y: receiverAddress,
    deadline,
    maximum_tokens_contributed: DEFAULT_TOKENS_CONTRIBUTED,
    referral_code: QUIPUSWAP_REFERRAL_CODE
  });

  return await V3LiquidityParams.send();
};
