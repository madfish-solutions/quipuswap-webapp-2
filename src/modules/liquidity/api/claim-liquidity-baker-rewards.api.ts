import { CLAIM_BOT_CLAIM_REWARDS_URL } from '@config/constants';
import { jsonFetch } from '@shared/api';

export interface Payload {
  publicKey: string;
  poolId: string;
  timestamp: string;
}
export interface ClaimRequestBody {
  payload: Payload;
  payloadBytes: string;
  signature: string;
}

export const claimLiquidityBakerRewards = async (body: ClaimRequestBody): Promise<{ opHash: string }> => {
  const bodyStr = JSON.stringify(body);

  const requestParams = {
    method: 'POST',
    body: bodyStr,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const { txHash } = await jsonFetch<{ txHash: string }>(CLAIM_BOT_CLAIM_REWARDS_URL, requestParams);

  return {
    opHash: txHash
  };
};
