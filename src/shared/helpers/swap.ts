import { TezosToolkit } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { getTradeOpParams, parseTransferParamsToParamsWithKind, Trade } from 'swap-router-sdk';

import { STABLESWAP_REFERRAL } from '@config/config';
import { QUIPUSWAP_REFERRAL_CODE } from '@config/constants';
import { DexPool } from '@modules/swap/types';
import { TokenId } from '@shared/types';

export interface SwapParams {
  deadlineTimespan?: number;
  inputToken: TokenId;
  inputAmount: BigNumber;
  dexChain: DexPool[];
  trade: Trade;
  slippageTolerance?: BigNumber;
  ttDexAddress?: string;
  recipient?: string;
}

// TODO: use recipient PKH
export const estimateSwapFee = async (
  tezos: TezosToolkit,
  accountPkh: string,
  trade: Trade,
  recipientPkh = accountPkh,
  deadlineTimespan?: BigNumber
) => {
  const tradeTransferParams = await getTradeOpParams(
    trade,
    accountPkh,
    tezos,
    STABLESWAP_REFERRAL,
    recipientPkh,
    deadlineTimespan?.toNumber(),
    QUIPUSWAP_REFERRAL_CODE.toNumber()
  );

  const estimations = await tezos.estimate.batch(
    tradeTransferParams.map(params => ({
      ...parseTransferParamsToParamsWithKind(params),
      source: accountPkh
    }))
  );

  return estimations.reduce<BigNumber>(
    (
      acc,
      {
        storageLimit,
        suggestedFeeMutez,
        // @ts-ignore
        minimalFeePerStorageByteMutez
      }
    ) => acc.plus(suggestedFeeMutez).plus(storageLimit * minimalFeePerStorageByteMutez),
    new BigNumber(0)
  );
};
